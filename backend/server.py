from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from datetime import datetime

app = Flask(__name__)
# Allow requests from http://127.0.0.1:5503 (your new project)
# CORS(app, origins=["http://127.0.0.1:5503"])
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins for development

# Initialize SQLite database with separate tables
def init_db():
    conn = sqlite3.connect("new_project_storage.db")
    cursor = conn.cursor()

    # Create Users table (for orders)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS Users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fullName TEXT NOT NULL,
            phone TEXT NOT NULL,
            email TEXT NOT NULL,
            address TEXT NOT NULL,
            notes TEXT,
            date TEXT NOT NULL,
            status TEXT DEFAULT 'pending'
        )
    """)

    # Create OrderItems table with total and status
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS OrderItems (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER NOT NULL,
            name TEXT NOT NULL,
            price REAL NOT NULL,
            quantity INTEGER NOT NULL,
            total REAL GENERATED ALWAYS AS (price * quantity) VIRTUAL,
            img TEXT,
            status TEXT DEFAULT 'pending',
            FOREIGN KEY (userId) REFERENCES Users(id)
        )
    """)

    # Create Contacts table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS Contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            subject TEXT NOT NULL,
            message TEXT NOT NULL,
            date TEXT NOT NULL
        )
    """)

    # Create Logins table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS Logins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL,
            password TEXT NOT NULL,
            date TEXT NOT NULL
        )
    """)
    
    # Create Users table for authentication
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS RegisteredUsers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT NOT NULL,
            password TEXT NOT NULL,
            date_of_birth TEXT,
            join_date TEXT NOT NULL,
            last_login TEXT
        )
    """)

    conn.commit()
    conn.close()

init_db()  # Run database setup

# API to save order data
@app.route("/saveOrder", methods=["POST"])
def save_order():
    try:
        data = request.json
        
        # Save user data to Users table
        conn = sqlite3.connect("new_project_storage.db")
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO Users (fullName, phone, email, address, notes, date, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            data["userInfo"]["fullName"],
            data["userInfo"]["phone"],
            data["userInfo"]["email"],
            data["userInfo"]["address"],
            data["userInfo"].get("notes", ""),
            data["date"],
            data.get("status", "pending")
        ))
        
        user_id = cursor.lastrowid  # Get the ID of the newly inserted user

        # Save order items
        for item in data["orderItems"]:
            cursor.execute("""
                INSERT INTO OrderItems (userId, name, price, quantity, img, status)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (
                user_id,
                item["name"],
                item["price"],
                item["qty"],
                item.get("img", ""),
                item.get("status", "pending")
            ))

        conn.commit()
        conn.close()

        return jsonify({
            "message": "Order saved successfully", 
            "status": "success",
            "orderId": user_id
        }), 200
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500

# API to save contact data
@app.route("/saveContact", methods=["POST"])
def save_contact():
    try:
        data = request.json
        conn = sqlite3.connect("new_project_storage.db")
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO Contacts (name, email, phone, subject, message, date)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            data["name"],
            data["email"],
            data.get("phone", ""),
            data["subject"],
            data["message"],
            data["date"]
        ))
        
        conn.commit()
        conn.close()
        return jsonify({"message": "Contact message saved successfully", "status": "success"}), 200
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500

# API to save login data
@app.route("/saveLogin", methods=["POST"])
def save_login():
    try:
        data = request.json
        conn = sqlite3.connect("new_project_storage.db")
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO Logins (email, password, date)
            VALUES (?, ?, ?)
        """, (
            data["email"],
            data["password"],
            data["date"]
        ))
        
        conn.commit()
        conn.close()
        return jsonify({"message": "Login data saved successfully", "status": "success"}), 200
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500




# API to register new user
@app.route("/register", methods=["POST"])
def register_user():
    try:
        data = request.json
        
        # Validate required fields
        if not all(key in data for key in ['full_name', 'email', 'phone', 'password']):
            return jsonify({"error": "Missing required fields", "status": "error"}), 400
        
        # Validate password length
        if len(data['password']) < 5:
            return jsonify({"error": "Password must be at least 5 characters", "status": "error"}), 400

        # Hash password (in production, use proper hashing like bcrypt)
        hashed_password = data['password']  # In real app, hash this properly
        
        conn = sqlite3.connect("new_project_storage.db")
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                INSERT INTO RegisteredUsers 
                (full_name, email, phone, password, date_of_birth, join_date)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (
                data['full_name'],
                data['email'],
                data['phone'],
                hashed_password,
                data.get('date_of_birth'),
                datetime.now().isoformat()
            ))
            
            conn.commit()
            return jsonify({
                "message": "Registration successful", 
                "status": "success",
                "userId": cursor.lastrowid
            }), 201
            
        except sqlite3.IntegrityError:
            return jsonify({"error": "Email already exists", "status": "error"}), 400
            
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500
    finally:
        conn.close()

# API to authenticate user
@app.route("/login", methods=["POST"])
def login_user():
    try:
        data = request.json
        
        # Validate required fields
        if not all(key in data for key in ['email', 'password']):
            return jsonify({"error": "Email and password required", "status": "error"}), 400

        conn = sqlite3.connect("new_project_storage.db")
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT id, full_name, email, password FROM RegisteredUsers 
            WHERE email = ?
        """, (data['email'],))
        
        user = cursor.fetchone()
        
        if not user:
            return jsonify({"error": "Invalid email or password", "status": "error"}), 401
            
        # In production, use proper password verification with hashing
        if user[3] != data['password']:  # Compare plain text (for demo only)
            return jsonify({"error": "Invalid email or password", "status": "error"}), 401
            
        # Update last login
        cursor.execute("""
            UPDATE RegisteredUsers SET last_login = ? WHERE id = ?
        """, (datetime.now().isoformat(), user[0]))
        
        # ALSO save to Logins table (like the old system)
        cursor.execute("""
            INSERT INTO Logins (email, password, date)
            VALUES (?, ?, ?)
        """, (
            data['email'],
            data['password'],  # Note: In production, don't store plain text passwords
            datetime.now().isoformat()
        ))
        
        conn.commit()
        
        return jsonify({
            "message": "Login successful", 
            "status": "success",
            "user": {
                "id": user[0],
                "full_name": user[1],
                "email": user[2]
            }
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500
    finally:
        conn.close()
        
        
        
        
        
        
# API to fetch all orders (for admin purposes)
@app.route("/getOrders", methods=["GET"])
def get_orders():
    try:
        conn = sqlite3.connect("new_project_storage.db")
        cursor = conn.cursor()
        
        # Modified query to include prices in the items string
        cursor.execute("""
            SELECT 
                u.id, u.fullName, u.phone, u.email, u.address, 
                u.notes, u.date, u.status as order_status,
                GROUP_CONCAT(oi.name || ' (' || oi.quantity || 'x @ $' || oi.price || ')') as items,
                SUM(oi.total) as grand_total,
                GROUP_CONCAT(oi.status) as item_statuses
            FROM Users u
            JOIN OrderItems oi ON u.id = oi.userId
            GROUP BY u.id
            ORDER BY u.date DESC
        """)
        
        orders = []
        for row in cursor.fetchall():
            orders.append({
                "id": row[0],
                "fullName": row[1],
                "phone": row[2],
                "email": row[3],
                "address": row[4],
                "notes": row[5],
                "date": row[6],
                "orderStatus": row[7],
                "items": row[8],
                "grandTotal": row[9],
                "itemStatuses": row[10].split(',') if row[10] else []
            })
        
        conn.close()
        return jsonify({"orders": orders, "status": "success"}), 200
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500

# API to fetch all contacts (for admin purposes)
@app.route("/getContacts", methods=["GET"])
def get_contacts():
    try:
        conn = sqlite3.connect("new_project_storage.db")
        cursor = conn.cursor()
        
        cursor.execute("SELECT * FROM Contacts ORDER BY date DESC")
        
        contacts = []
        for row in cursor.fetchall():
            contacts.append({
                "id": row[0],
                "name": row[1],
                "email": row[2],
                "phone": row[3],
                "subject": row[4],
                "message": row[5],
                "date": row[6]
            })
        
        conn.close()
        return jsonify({"contacts": contacts, "status": "success"}), 200
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500

# API to fetch all login data (for admin purposes)
@app.route("/getLogins", methods=["GET"])
def get_logins():
    try:
        conn = sqlite3.connect("new_project_storage.db")
        cursor = conn.cursor()
        
        cursor.execute("SELECT * FROM Logins ORDER BY date DESC")
        
        logins = []
        for row in cursor.fetchall():
            logins.append({
                "id": row[0],
                "email": row[1],
                "password": "********",  # Mask passwords for security
                "date": row[3]
            })
        
        conn.close()
        return jsonify({"logins": logins, "status": "success"}), 200
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500
    
    
    
    
# API to fetch all registered users (for admin purposes)
@app.route("/getRegisteredUsers", methods=["GET"])
def get_registered_users():
    try:
        conn = sqlite3.connect("new_project_storage.db")
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT id, full_name, email, phone, password, date_of_birth, join_date, last_login 
            FROM RegisteredUsers 
            ORDER BY join_date DESC
        """)
        
        users = []
        for row in cursor.fetchall():
            users.append({
                "id": row[0],
                "full_name": row[1],
                "email": row[2],
                "phone": row[3],
                "password": row[4],  # Now including the actual password
                "date_of_birth": row[5],
                "join_date": row[6],
                "last_login": row[7],
                "status": "Active" if row[7] else "Never logged in"
            })
        
        conn.close()
        return jsonify({"users": users, "status": "success"}), 200
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500





@app.route("/updateUserPassword", methods=["POST"])
def update_user_password():
    try:
        data = request.json
        user_id = data["userId"]
        new_password = data["newPassword"]
        
        # Validate password length
        if len(new_password) < 5:
            return jsonify({"error": "Password must be at least 5 characters", "status": "error"}), 400

        conn = sqlite3.connect("new_project_storage.db")
        cursor = conn.cursor()
        
        # Update password
        cursor.execute("""
            UPDATE RegisteredUsers SET password = ? WHERE id = ?
        """, (new_password, user_id))
        
        conn.commit()
        return jsonify({
            "message": "Password updated successfully",
            "status": "success"
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500
    finally:
        conn.close()
        
        

# API to fetch specific user details
@app.route("/getUser/<int:user_id>", methods=["GET"])
def get_user(user_id):
    try:
        conn = sqlite3.connect("new_project_storage.db")
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT id, full_name, email, phone, date_of_birth, join_date, last_login 
            FROM RegisteredUsers 
            WHERE id = ?
        """, (user_id,))
        
        row = cursor.fetchone()
        
        if not row:
            return jsonify({"error": "User not found", "status": "error"}), 404
        
        user = {
            "id": row[0],
            "full_name": row[1],
            "email": row[2],
            "phone": row[3],
            "date_of_birth": row[4],
            "join_date": row[5],
            "last_login": row[6]
        }
        
        conn.close()
        return jsonify({"user": user, "status": "success"}), 200
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500
    
    

# API to fetch all data (orders, contacts, logins)
@app.route("/getData", methods=["GET"])
def get_data():
    try:
        conn = sqlite3.connect("new_project_storage.db")
        cursor = conn.cursor()

        # Get all orders
        cursor.execute("""
            SELECT 
                u.id, u.fullName, u.phone, u.email, u.address, 
                u.notes, u.date, u.status as order_status,
                GROUP_CONCAT(oi.name || ' (' || oi.quantity || 'x)') as items,
                SUM(oi.total) as grand_total
            FROM Users u
            JOIN OrderItems oi ON u.id = oi.userId
            GROUP BY u.id
            ORDER BY u.date DESC
        """)
        orders = []
        for row in cursor.fetchall():
            orders.append({
                "id": row[0],
                "fullName": row[1],
                "phone": row[2],
                "email": row[3],
                "address": row[4],
                "notes": row[5],
                "date": row[6],
                "orderStatus": row[7],
                "items": row[8],
                "grandTotal": row[9]
            })

        # Get all contacts
        cursor.execute("SELECT * FROM Contacts ORDER BY date DESC")
        contacts = []
        for row in cursor.fetchall():
            contacts.append({
                "id": row[0],
                "name": row[1],
                "email": row[2],
                "phone": row[3],
                "subject": row[4],
                "message": row[5],
                "date": row[6]
            })

        # Get all logins (with masked passwords)
        cursor.execute("SELECT * FROM Logins ORDER BY date DESC")
        logins = []
        for row in cursor.fetchall():
            logins.append({
                "id": row[0],
                "email": row[1],
                "password": "********",
                "date": row[3]
            })

        conn.close()
        return jsonify({
            "orders": orders,
            "contacts": contacts,
            "logins": logins,
            "status": "success"
        }), 200
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500

# API to update order status
@app.route("/updateOrderStatus", methods=["POST"])
def update_order_status():
    try:
        data = request.json
        order_id = data["orderId"]
        new_status = data["status"]
        
        conn = sqlite3.connect("new_project_storage.db")
        cursor = conn.cursor()
        
        # Update order status
        cursor.execute("""
            UPDATE Users SET status = ? WHERE id = ?
        """, (new_status, order_id))
        
        # Update all order items status if requested
        if data.get("updateItems", False):
            cursor.execute("""
                UPDATE OrderItems SET status = ? WHERE userId = ?
            """, (new_status, order_id))
        
        conn.commit()
        conn.close()
        return jsonify({
            "message": "Order status updated successfully",
            "status": "success"
        }), 200
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500
    
    

# API to fetch specific order details
@app.route("/getOrder/<int:order_id>", methods=["GET"])
def get_order(order_id):
    try:
        conn = sqlite3.connect("new_project_storage.db")
        cursor = conn.cursor()
        
        # Get order header information
        cursor.execute("""
            SELECT id, fullName, phone, email, address, notes, date, status 
            FROM Users 
            WHERE id = ?
        """, (order_id,))
        
        order_header = cursor.fetchone()
        
        if not order_header:
            return jsonify({"error": "Order not found", "status": "error"}), 404
        
        # Get order items
        cursor.execute("""
            SELECT id, name, price, quantity, total, img, status 
            FROM OrderItems 
            WHERE userId = ?
        """, (order_id,))
        
        items = []
        for row in cursor.fetchall():
            items.append({
                "id": row[0],
                "name": row[1],
                "price": row[2],
                "quantity": row[3],
                "total": row[4],
                "img": row[5],
                "status": row[6]
            })
        
        conn.close()
        
        return jsonify({
            "status": "success",
            "order": {
                "id": order_header[0],
                "fullName": order_header[1],
                "phone": order_header[2],
                "email": order_header[3],
                "address": order_header[4],
                "notes": order_header[5],
                "date": order_header[6],
                "orderStatus": order_header[7],
                "items": items,
                "grandTotal": sum(item['total'] for item in items)
            }
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5001)  # Using port 5001 to avoid conflict with old project