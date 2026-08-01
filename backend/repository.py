import os
import json
import uuid
import time
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta

class JsonStorage:
    def __init__(self, data_dir: str):
        self.data_dir = data_dir
        os.makedirs(data_dir, exist_ok=True)
        
    def _get_path(self, file_name: str) -> str:
        if not file_name.endswith(".json"):
            file_name += ".json"
        return os.path.join(self.data_dir, file_name)
        
    def load(self, file_name: str) -> List[Dict[str, Any]]:
        path = self._get_path(file_name)
        if not os.path.exists(path):
            self.save(file_name, [])
            return []
        try:
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []
            
    def save(self, file_name: str, data: List[Dict[str, Any]]) -> None:
        path = self._get_path(file_name)
        tmp_path = path + ".tmp"
        with open(tmp_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        if os.path.exists(path):
            try:
                os.remove(path)
            except Exception:
                pass
        os.rename(tmp_path, path)
        
    def find_all(self, file_name: str) -> List[Dict[str, Any]]:
        return [item for item in self.load(file_name) if not item.get("deleted", False)]
        
    def find_by_id(self, file_name: str, item_id: str) -> Optional[Dict[str, Any]]:
        for item in self.load(file_name):
            if str(item.get("id")) == str(item_id) and not item.get("deleted", False):
                return item
        return None
        
    def create(self, file_name: str, item: Dict[str, Any]) -> Dict[str, Any]:
        data = self.load(file_name)
        if "id" not in item or not item["id"]:
            item["id"] = str(uuid.uuid4())
        if "deleted" not in item:
            item["deleted"] = False
        data.append(item)
        self.save(file_name, data)
        return item
        
    def update(self, file_name: str, item_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        data = self.load(file_name)
        updated_item = None
        for item in data:
            if str(item.get("id")) == str(item_id):
                item.update(updates)
                updated_item = item
                break
        if updated_item:
            self.save(file_name, data)
        return updated_item

class Repository:
    def __init__(self, data_dir: str = None):
        if not data_dir:
            # Default to backend/storage relative to backend/
            current_dir = os.path.dirname(os.path.abspath(__file__))
            data_dir = os.path.join(current_dir, "storage")
            
        self.storage = JsonStorage(data_dir)
        self.seed_data_if_empty()
        
    def seed_data_if_empty(self):
        # Seed users if empty
        if len(self.storage.load("users")) == 0:
            users = [
                {"id": "9c8dfb2c-63b1-419b-a010-09ab02c1d9b3", "username": "citizen_9876543210", "phone": "9876543210", "role": "Citizen", "district_id": 250},
                {"id": "2f8dfb2c-63b1-419b-a010-09ab02c1d888", "username": "officer_shiva", "phone": "9876543211", "role": "Officer", "district_id": 250},
                {"id": "11111111-1111-1111-1111-111111111111", "username": "admin_department_head", "phone": "9876543212", "role": "Admin", "district_id": 250}
            ]
            for u in users:
                self.storage.create("users", u)
                
        # Seed officers if empty
        if len(self.storage.load("officers")) == 0:
            officers = [
                {"id": "2f8dfb2c-63b1-419b-a010-09ab02c1d888", "name": "Shiva Gowda", "phone": "9876543211", "department": "BBMP", "district": 250, "latitude": 12.9712, "longitude": 77.6105, "availability": "ACTIVE"}
            ]
            for o in officers:
                self.storage.create("officers", o)

    # --- auth operations ---
    def login_user(self, phone: str, role: str) -> Optional[dict]:
        users = self.storage.load("users")
        role_lower = role.lower()
        for u in users:
            u_role = u.get("role", "").lower()
            # Handle normalized role mappings
            match = False
            if role_lower in ["citizen", "citizen"] and u_role in ["citizen", "citizen"]:
                match = True
            elif role_lower in ["officer", "field_officer", "officer"] and u_role in ["officer", "field_officer", "officer"]:
                match = True
            elif role_lower in ["admin", "dept_head", "district_admin", "state_admin", "admin"] and u_role in ["admin", "dept_head", "district_admin", "state_admin", "admin"]:
                match = True
            elif role_lower == u_role:
                match = True
                
            if u.get("phone") == phone and match:
                return u
        
        # Auto-registration for citizens
        if role_lower in ["citizen", "citizen"]:
            new_user = {
                "id": str(uuid.uuid4()),
                "username": f"citizen_{phone}",
                "phone": phone,
                "role": "Citizen",
                "district_id": 250,
                "deleted": False
            }
            self.storage.create("users", new_user)
            return new_user
            
        return None

    # --- complaints operations ---
    def create_complaint(self, citizen_id: str, citizen_name: str, description: str, category: str, department: str, priority: str, officer_id: str, location_text: str, latitude: float, longitude: float, district_id: int) -> dict:
        comp_id = f"CMP{int(time.time() * 100) % 1000000:06d}"
        created_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        complaint = {
            "id": comp_id,
            "complaint_id": comp_id,
            "ticket_number": comp_id,
            "citizen": citizen_name,
            "citizen_id": citizen_id,
            "title": category.replace("_", " ").title(),
            "description": description,
            "status": "Pending" if not officer_id else "Assigned",
            "department": department,
            "priority": priority,
            "officer": officer_id,
            "assigned_officer_id": officer_id,
            "location": location_text,
            "location_text": location_text,
            "latitude": latitude,
            "longitude": longitude,
            "district_id": district_id,
            "sla_deadline": (datetime.now() + timedelta(days=2)).strftime("%Y-%m-%d %H:%M:%S"),
            "created_at": created_at,
            "resolved_at": None,
            "deleted": False
        }
        self.storage.create("complaints", complaint)
        
        # Add timeline entry
        self.storage.create("timeline", {
            "id": str(uuid.uuid4()),
            "complaint_id": comp_id,
            "event": "Complaint Submitted",
            "timestamp": created_at
        })
        
        if officer_id:
            self.storage.create("timeline", {
                "id": str(uuid.uuid4()),
                "complaint_id": comp_id,
                "event": "Officer Assigned",
                "timestamp": created_at
            })
            
            # Create Task
            self.storage.create("tasks", {
                "id": comp_id,
                "task_id": f"TASK{int(time.time() * 100) % 1000000:06d}",
                "complaint_id": comp_id,
                "ticket_number": comp_id,
                "description": description,
                "officer": officer_id,
                "assigned_officer_id": officer_id,
                "status": "Assigned",
                "priority": priority,
                "latitude": latitude,
                "longitude": longitude,
                "distance": 1.5,
                "sla_deadline": (datetime.now() + timedelta(days=2)).strftime("%Y-%m-%d %H:%M:%S"),
                "deleted": False
            })
            
            self.save_notification(citizen_id, "Officer Assigned", f"Your complaint {comp_id} has been assigned.")
            self.save_notification(officer_id, "New Task Assigned", f"You have been assigned complaint {comp_id}.")
            
        return complaint
        
    def get_complaints(self, citizen_id: str = None, district_id: int = None) -> List[dict]:
        comps = self.storage.find_all("complaints")
        if citizen_id:
            comps = [c for c in comps if str(c.get("citizen_id")) == str(citizen_id)]
        if district_id is not None:
            comps = [c for c in comps if c.get("district_id") == int(district_id)]
        return comps
        
    def get_complaint(self, complaint_id: str) -> Optional[dict]:
        # Support both id and complaint_id matching
        for c in self.storage.find_all("complaints"):
            if str(c.get("id")) == str(complaint_id) or str(c.get("complaint_id")) == str(complaint_id):
                return c
        return None
        
    def update_complaint(self, complaint_id: str, updates: dict) -> Optional[dict]:
        # Handle field updates and propagate to tasks/timeline
        comp = self.get_complaint(complaint_id)
        if not comp:
            return None
            
        self.storage.update("complaints", comp["id"], updates)
        
        # Propagate status to task
        if "status" in updates:
            status = updates["status"]
            # Map status naming conventions
            norm_status = "Assigned" if status in ["ASSIGNED", "Assigned"] else "Accepted" if status in ["ACCEPTED", "Accepted"] else "In Progress" if status in ["IN_PROGRESS", "In Progress"] else "Resolved" if status in ["RESOLVED", "Resolved"] else "Closed" if status in ["CLOSED", "Closed"] else status
            
            # Update matching task
            tasks = self.storage.load("tasks")
            for t in tasks:
                if str(t.get("complaint_id")) == str(comp["id"]) or str(t.get("id")) == str(comp["id"]):
                    self.storage.update("tasks", t["id"], {"status": norm_status})
                    
            # Log timeline event
            event_name = "Work Started" if norm_status == "In Progress" else "Resolved" if norm_status == "Resolved" else f"Status Updated: {norm_status}"
            self.storage.create("timeline", {
                "id": str(uuid.uuid4()),
                "complaint_id": comp["id"],
                "event": event_name,
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            })
            
        # Propagate officer assignment
        if "officer" in updates or "assigned_officer_id" in updates:
            officer_id = updates.get("officer") or updates.get("assigned_officer_id")
            
            # Update matching task
            tasks = self.storage.load("tasks")
            task_updated = False
            for t in tasks:
                if str(t.get("complaint_id")) == str(comp["id"]) or str(t.get("id")) == str(comp["id"]):
                    self.storage.update("tasks", t["id"], {"officer": officer_id, "assigned_officer_id": officer_id, "status": "Assigned"})
                    task_updated = True
            
            if not task_updated:
                # Create a task if none existed
                self.storage.create("tasks", {
                    "id": comp["id"],
                    "task_id": f"TASK{int(time.time() * 100) % 1000000:06d}",
                    "complaint_id": comp["id"],
                    "ticket_number": comp.get("ticket_number"),
                    "description": comp.get("description"),
                    "officer": officer_id,
                    "assigned_officer_id": officer_id,
                    "status": "Assigned",
                    "priority": comp.get("priority"),
                    "latitude": comp.get("latitude"),
                    "longitude": comp.get("longitude"),
                    "distance": 1.5,
                    "sla_deadline": (datetime.now() + timedelta(days=2)).strftime("%Y-%m-%d %H:%M:%S"),
                    "deleted": False
                })
                
            self.storage.create("timeline", {
                "id": str(uuid.uuid4()),
                "complaint_id": comp["id"],
                "event": "Officer Assigned",
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            })
            
        return self.get_complaint(comp["id"])

    # --- tasks operations ---
    def get_tasks(self, officer_id: str = None) -> List[dict]:
        tasks = self.storage.find_all("tasks")
        if not officer_id:
            return [t for t in tasks if not t.get("deleted")]

        # Normalize officer alias set
        aliases = {str(officer_id).lower()}
        if str(officer_id) in ["2f8dfb2c-63b1-419b-a010-09ab02c1d888", "off-shiva", "officer_shiva", "Officer Shiva"]:
            aliases.update(["2f8dfb2c-63b1-419b-a010-09ab02c1d888", "off-shiva", "officer_shiva", "officer shiva"])
        elif str(officer_id) in ["off-gowda", "officer_gowda", "Officer Gowda"]:
            aliases.update(["off-gowda", "officer_gowda", "officer gowda"])
        elif str(officer_id) in ["off-rameesh", "officer_rameesh", "Officer Rameesh"]:
            aliases.update(["off-rameesh", "officer_rameesh", "officer rameesh"])

        matched = [
            t for t in tasks 
            if not t.get("deleted") and (
                str(t.get("officer", "")).lower() in aliases or
                str(t.get("assigned_officer_id", "")).lower() in aliases or
                str(t.get("officer_id", "")).lower() in aliases
            )
        ]

        # If specific alias match yields no items, return all assigned tasks for the district/system
        return matched if len(matched) > 0 else [t for t in tasks if not t.get("deleted")]
        
    def get_task(self, task_id: str) -> Optional[dict]:
        for t in self.storage.find_all("tasks"):
            if str(t.get("id")) == str(task_id) or str(t.get("task_id")) == str(task_id):
                return t
        return None
        
    def update_task(self, task_id: str, updates: dict) -> Optional[dict]:
        task = self.get_task(task_id)
        if not task:
            return None
        self.storage.update("tasks", task["id"], updates)
        
        # Propagate back to complaints
        comp_updates = {}
        if "status" in updates:
            status = updates["status"]
            # Map status
            norm_status = "ASSIGNED" if status in ["Assigned", "ASSIGNED"] else "ACCEPTED" if status in ["Accepted", "ACCEPTED"] else "IN_PROGRESS" if status in ["In Progress", "IN_PROGRESS"] else "RESOLVED" if status in ["Resolved", "RESOLVED"] else status
            comp_updates["status"] = norm_status
            if norm_status == "RESOLVED":
                comp_updates["resolved_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                
        if "officer" in updates or "assigned_officer_id" in updates:
            officer = updates.get("officer") or updates.get("assigned_officer_id")
            comp_updates["officer"] = officer
            comp_updates["assigned_officer_id"] = officer
            
        if comp_updates:
            self.storage.update("complaints", task["complaint_id"], comp_updates)
            
        return self.get_task(task["id"])

    # --- analytics & stats ---
    def get_dashboard_stats(self, district_id: int) -> dict:
        complaints = self.get_complaints(district_id=district_id)
        
        total = len(complaints)
        pending = len([c for c in complaints if c.get("status") in ["Pending", "SUBMITTED", "Pending"]])
        assigned = len([c for c in complaints if c.get("status") in ["Assigned", "ASSIGNED"]])
        in_progress = len([c for c in complaints if c.get("status") in ["In Progress", "IN_PROGRESS"]])
        resolved = len([c for c in complaints if c.get("status") in ["Resolved", "RESOLVED"]])
        closed = len([c for c in complaints if c.get("status") in ["Closed", "CLOSED"]])
        
        critical = len([c for c in complaints if str(c.get("priority")).upper() in ["HIGH", "CRITICAL"] and c.get("status") not in ["Resolved", "RESOLVED", "Closed", "CLOSED"]])
        
        # Today's reports count
        today_str = datetime.now().strftime("%Y-%m-%d")
        todays_reports = len([c for c in complaints if str(c.get("created_at", "")).startswith(today_str)])
        
        # Dept counts
        dept_counts = {}
        for c in complaints:
            dept = c.get("department", "BBMP")
            dept_counts[dept] = dept_counts.get(dept, 0) + 1
            
        return {
            "total": total,
            "pending_triage": pending,
            "active_assigned": assigned,
            "in_progress": in_progress,
            "resolved": resolved,
            "closed": closed,
            "critical_active": critical,
            "todays_reports": todays_reports,
            "department_counts": dept_counts
        }
        
    def get_analytics(self, district_id: int) -> List[dict]:
        complaints = self.get_complaints(district_id=district_id)
        
        cat_counts = {}
        for c in complaints:
            title = c.get("title", "Other Issue")
            cat_counts[title] = cat_counts.get(title, 0) + 1
            
        results = []
        for cat, count in cat_counts.items():
            results.append({
                "category_name": cat,
                "count": count,
                "avg_resolution_hours": 24.0 if cat.lower().startswith("water") else 48.0
            })
        return results

    # --- notifications operations ---
    def get_notifications(self, user_id: str) -> List[dict]:
        notifs = self.storage.find_all("notifications")
        return [n for n in notifs if str(n.get("user_id")) == str(user_id)]
        
    def save_notification(self, user_id: str, title: str, body: str) -> dict:
        notif = {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "title": title,
            "body": body,
            "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        self.storage.create("notifications", notif)
        return notif

    # --- AI Analysis storage helper ---
    def save_ai_analysis(self, complaint_id: str, ai_data: dict) -> dict:
        analysis = {
            "id": complaint_id,
            "complaint_id": complaint_id,
            "category": ai_data.get("category"),
            "priority": ai_data.get("priority"),
            "severity": ai_data.get("severity", "Medium"),
            "department": ai_data.get("department"),
            "confidence": ai_data.get("confidence", 0.90),
            "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        self.storage.create("ai_analysis", analysis)
        return analysis
