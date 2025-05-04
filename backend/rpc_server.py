from flask import Flask, request, jsonify
from flask_cors import CORS
import random
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Sample food data
FOOD_MENU = [
    {"id": 1, "name": "បាយស្រូប", "category": "food", "price": 1.25, 
     "desc": "បាយសាច់ជ្រូកពងទាចៀន", "image": "img/food/f1.jpg"},
    {"id": 2, "name": "បាយម្រះព្រូវ", "category": "food", "price": 1.50, 
     "desc": "បាយឆារម្រះព្រូវ with ពងទាចៀន", "image": "img/food/f2.jpg"},
    {"id": 3, "name": "ហ្វឺ", "category": "soup", "price": 2.50, 
     "desc": "ហ្វឺប្រហិតសាច់គោ", "image": "img/food/s1.jpg"},
    {"id": 4, "name": "គុយទាវ", "category": "soup", "price": 2.50, 
     "desc": "គុយទាវប្រហិតសាច់គោ", "image": "img/food/s2.jpg"},
    {"id": 5, "name": "កាហ្វេ", "category": "drink", "price": 1.00, 
     "desc": "កាហ្វេទឹកដោះគោទឹកកក(សាកថ្មបាន)", "image": "img/food/d1.jpg"},
    {"id": 6, "name": "Milk Tea", "category": "drink", "price": 2.00, 
     "desc": "តែចិន Olong Tea with sweat steam milk and Boba", "image": "img/food/d2.jpg"}
]

# Team data
TEAM_MEMBERS = [
    {
        "name": "DOK DOMIMIQUE",
        "position": "MANAGER",
        "id": "E20210337",
        "joined": "January 2022",
        "experience": "5 Years",
        "image": "img/team/m1.jpg"
    },
    {
        "name": "ENG SIVE EU",
        "position": "CASHIER",
        "id": "E20210914",
        "joined": "March 2022",
        "experience": "4 Years",
        "image": "img/team/m2.jpg"
    },
    {
        "name": "EN SREYTHOM",
        "position": "CHEF",
        "id": "E20210084",
        "joined": "May 2022",
        "experience": "3 Years",
        "image": "img/team/m3.jpg"
    },
    {
        "name": "KHOEM SIVIN",
        "position": "WAITER",
        "id": "E20211015",
        "joined": "July 2022",
        "experience": "3 Years",
        "image": "img/team/m4.jpg"
    },
    {
        "name": "CHAN SOPHARA",
        "position": "ពូម៉ូតូឌុប",
        "id": "E20211081",
        "joined": "September 2022",
        "experience": "6 Years",
        "image": "img/team/m5.jpg"
    }
]

# Current promotions
PROMOTIONS = [
    {"title": "Free Delivery", "description": "Free delivery for orders over $10 🚚", "code": "FREESHIP10"},
    {"title": "Friday Special", "description": "Buy 1 get 1 free on Milk Tea every Friday 🧋", "code": "BOGOFRIDAY"},
    {"title": "Student Discount", "description": "15% student discount with valid ID 🎓", "code": "STUDENT15"}
]

def get_current_time():
    """Return formatted current time for logging"""
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

def log_request(message, language):
    """Log client request"""
    print(f"\n[{get_current_time()}] CLIENT SEND REQUEST -->")
    print(f"User ({language}): {message}")

def log_server_response(response):
    """Log server response"""
    print(f"[{get_current_time()}] SERVER SEND RESPONSE -->")
    if isinstance(response, dict) and 'message' in response:
        print(f"Bot: {response['message']}")
    elif isinstance(response, dict) and 'text' in response:
        print(f"Bot: {response['text']}")
    else:
        print("Bot: [Sending complex response]")

def log_processing():
    """Log processing message"""
    print(f"[{get_current_time()}] SERVER RECEIVE REQUEST ... PROCESSING")

class ChatbotRPCServer:
    def __init__(self):
        self.responses = {
            'en': {
                'greeting': ["Hello there! 😊 How can I assist you today?", "Hi! 👋 What can I do for you?", "Greetings! 🎉 How may I help you with your food order?"],
                'location': {
                    "text": "📍 Our shop is located at: \n\nTechno, Russian Federation Blvd\nPhnom Penh, Cambodia",
                    "map_url": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d913.7572395098525!2d104.89893722936601!3d11.570531667615736!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31095135c2ad598d%3A0xb2d48d6f11032091!2sDepartment%20of%20Applied%20Mathematics%20and%20Statistics%20(AMS)!5e1!3m2!1sen!2skh!4v1742013965831!5m2!1sen!2skh",
                    "action": "map"
                },
                'contact': "📞 You can reach us at:\n\nPhone: +855 973 513 505\nEmail: info@deliciouseats.com\n\nWe're available 9AM-9PM daily! 🕒",
                'about': "ℹ️ Delicious Eats is a premium food delivery service bringing you the best culinary experiences from top restaurants right to your doorstep. 🍽️\n\nFounded in 2023, we're committed to delivering delicious meals with a smile! 😊",
                'hours': "🕒 Our opening hours:\n\nMonday - Sunday: 9:00 AM to 9:00 PM\n\nWe deliver 7 days a week! 🚴‍♂️",
                'team': {
                    "text": "👥 Here's our amazing team:",
                    "members": TEAM_MEMBERS,
                    "action": "team"
                },
                'youtube': {
                    "text": "🎥 Check out our YouTube channel for food videos and promotions:",
                    "url": "https://www.youtube.com/channel/UCrTEZy6WwgczJzw0BYCfu5Q",
                    "embed_url": "https://www.youtube.com/embed/UCrTEZy6WwgczJzw0BYCfu5Q",
                    "action": "youtube"
                },
                'order': "📦 Here's how to order:\n\n1️⃣ Browse our 🍔 menu\n2️⃣ Add items to your 🛒 cart\n3️⃣ Proceed to 💳 checkout\n4️⃣ Enter your 📍 delivery details\n5️⃣ Confirm your order!\n\n💡 Tip: You can say things like:\n- 'I want to order 2 បាយស្រូប'\n- 'Add Milk Tea to my cart'\n- 'Give me 1 ហ្វឺ and 1 គុយទាវ'\n\nEasy as pie! 🥧",
                'menu': {
                    "text": "🍔 Our menu features:",
                    "items": FOOD_MENU,
                    "action": "menu"
                },
                'promotions': {
                    "text": "🎉 Current promotions:",
                    "deals": PROMOTIONS,
                    "action": "promotions"
                },
                'default': "🤔 I'm not sure I understand. Could you try rephrasing or choose one of the quick suggestions below? 👇"
            },
            'km': {
                'greeting': ["សួស្តី! 😊 តើខ្ញុំអាចជួយអ្នកយ៉ាងដូចម្តេចខ្លះ?", "ជំរាបសួរ! 👋 តើអ្នកត្រូវការអ្វីខ្លះ?", "សួស្តី! 🎉 តើខ្ញុំអាចជួយអ្នកអំពីការបញ្ជាទិញម្ហូបយ៉ាងដូចម្តេច?"],
                'location': {
                    "text": "📍 ហាងរបស់យើងស្ថិតនៅ៖ \n\nផ្លូវហ្វេដឺរ៉ាស្យុងរុស្ស៊ី\nភ្នំពេញ កម្ពុជា",
                    "map_url": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d913.7572395098525!2d104.89893722936601!3d11.570531667615736!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31095135c2ad598d%3A0xb2d48d6f11032091!2sDepartment%20of%20Applied%20Mathematics%20and%20Statistics%20(AMS)!5e1!3m2!1sen!2skh!4v1742013965831!5m2!1sen!2skh",
                    "action": "map"
                },
                'contact': "📞 អ្នកអាចទាក់ទងមកយើងខ្ញុំតាមរយៈ៖\n\nទូរស័ព្ទ៖ +855 973 513 505\nអ៊ីមែល៖ info@deliciouseats.com\n\nយើងខ្ញុំនៅរង់ចាំទទួលសំណួររបស់អ្នករាល់ថ្ងៃពីម៉ោង 9:00 ព្រឹក ដល់ 9:00 យប់! 🕒",
                'about': "ℹ️ Delicious Eats គឺជាសេវាកម្មដឹកជញ្ជូនម្ហូបដែលនាំមកជូនអ្នកនូវបទពិសោធន៍ពិសេសពីភោជនីយដ្ឋានល្អៗបំផុតដែលនៅជិតអ្នកបំផុត។ �\n\nបង្កើតឡើងនៅឆ្នាំ 2023 យើងខ្ញុំមានបំណងនាំមកជូនអ្នកនូវម្ហូបឆ្ងាញ់ជាមួយនឹងស្នាមញញឹម! 😊",
                'hours': "🕒 ម៉ោងបើកហាងរបស់យើង៖\n\nច័ន្ទ - អាទិត្យ៖ 9:00 ព្រឹក ដល់ 9:00 យប់\n\nយើងខ្ញុំដឹកជញ្ជូនរាល់ថ្ងៃ! 🚴‍♂️",
                'team': {
                    "text": "👥 នេះគឺជាក្រុមការងារដ៏អស្ចារ្យរបស់យើង៖",
                    "members": TEAM_MEMBERS,
                    "action": "team"
                },
                'youtube': {
                    "text": "🎥 សូមមើលឆានែល YouTube របស់យើងសម្រាប់វីដេអូម្ហូប និងការផ្តល់ជូន៖",
                    "url": "https://www.youtube.com/channel/UCrTEZy6WwgczJzw0BYCfu5Q",
                    "embed_url": "https://www.youtube.com/embed/UCrTEZy6WwgczJzw0BYCfu5Q",
                    "action": "youtube"
                },
                'order': "📦 របៀបបញ្ជាទិញម្ហូប៖\n\n1️⃣ រុករកមើល 🍔 ម៉ឺនុយរបស់យើង\n2️⃣ បន្ថែមមុខម្ហូបទៅក្នុង 🛒 រទេះ\n3️⃣ បន្តទៅកាន់ 💳 ទូទាត់\n4️⃣ បញ្ចូលព័ត៌មានអំពី 📍 ការដឹកជញ្ជូន\n5️⃣ បញ្ជាក់ការបញ្ជាទិញរបស់អ្នក!\n\n💡 ព័ត៌មានបន្ថែម៖ អ្នកអាចនិយាយថា៖\n- 'ខ្ញុំចង់បញ្ជាទិញ 2 បាយស្រូប'\n- 'បន្ថែម Milk Tea ទៅក្នុងរទេះរបស់ខ្ញុំ'\n- 'យក 1 ហ្វឺ និង 1 គុយទាវ'\n\nងាយស្រួលណាស់! 🥧",
                'menu': {
                    "text": "🍔 ម៉ឺនុយរបស់យើងមាន៖",
                    "items": FOOD_MENU,
                    "action": "menu"
                },
                'promotions': {
                    "text": "🎉 ការផ្តល់ជូនបច្ចុប្បន្ន៖",
                    "deals": PROMOTIONS,
                    "action": "promotions"
                },
                'default': "🤔 ខ្ញុំសុំទោស ខ្ញុំមិនយល់ស្របទេ។ តើអ្នកអាចនិយាយម្តងទៀត ឬជ្រើសរើសមួយក្នុងចំណោមការណែនាំរហ័សខាងក្រោមទេ? 👇"
            }
        }

    def process_message(self, message, language='en'):
        """Process user message and return appropriate response"""
        # Log the incoming request
        log_request(message, language)
        
        # Convert to lowercase for easier matching
        lower_message = message.lower()
        lang_responses = self.responses.get(language, self.responses['en'])
        
        # Log that processing has started
        log_processing()
        
        # Check for greetings
        if any(word in lower_message for word in ['hello', 'hi', 'សួស្តី', 'ជំរាបសួរ']):
            response = {
                "action": "message",
                "message": random.choice(lang_responses['greeting'])
            }
            log_server_response(response)
            return response
        
        # Check for menu request
        if any(word in lower_message for word in ['menu', 'ម៉ឺនុយ', 'what do you have', 'offer', 'serve']):
            log_server_response(lang_responses['menu'])
            return lang_responses['menu']
        
        # Check for order requests
        order_keywords = ["order", "want", "would like", "get me", "give me", "បញ្ជាទិញ", "ទិញ", "យក"]
        if any(word in lower_message for word in order_keywords):
            # Find which food item they're asking for
            ordered_item = None
            for item in FOOD_MENU:
                if item["name"].lower() in lower_message:
                    ordered_item = item
                    break
            
            if ordered_item:
                # Default quantity is 1 unless specified
                quantity = 1
                if any(word in lower_message for word in ['two', '2', 'ពីរ']):
                    quantity = 2
                elif any(word in lower_message for word in ['three', '3', 'បី']):
                    quantity = 3
                elif any(word in lower_message for word in ['four', '4', 'បួន']):
                    quantity = 4
                
                response = {
                    "action": "add_to_cart",
                    "message": f"I've added {quantity} {ordered_item['name']} to your cart for ${ordered_item['price'] * quantity:.2f}." if language == 'en' 
                              else f"ខ្ញុំបានបន្ថែម {quantity} {ordered_item['name']} ទៅក្នុងរទេះរបស់អ្នកសម្រាប់ ${ordered_item['price'] * quantity:.2f}",
                    "data": {
                        "name": ordered_item["name"],
                        "price": ordered_item["price"],
                        "quantity": quantity,
                        "image": ordered_item["image"]
                    }
                }
                log_server_response(response)
                return response
            else:
                response = {
                    "action": "message",
                    "message": lang_responses['order']
                }
                log_server_response(response)
                return response
        
        # Check for other standard responses
        if any(word in lower_message for word in ['location', 'address', 'ទីតាំង', 'អាសយដ្ឋាន']):
            log_server_response(lang_responses['location'])
            return lang_responses['location']
        elif any(word in lower_message for word in ['contact', 'phone', 'ទំនាក់ទំនង', 'ទូរស័ព្ទ']):
            response = {
                "action": "message",
                "message": lang_responses['contact']
            }
            log_server_response(response)
            return response
        elif any(word in lower_message for word in ['about', 'អំពី']):
            response = {
                "action": "message",
                "message": lang_responses['about']
            }
            log_server_response(response)
            return response
        elif any(word in lower_message for word in ['open', 'hours', 'ម៉ោង', 'បើក']):
            response = {
                "action": "message",
                "message": lang_responses['hours']
            }
            log_server_response(response)
            return response
        elif any(word in lower_message for word in ['team', 'ក្រុម']):
            log_server_response(lang_responses['team'])
            return lang_responses['team']
        elif any(word in lower_message for word in ['youtube', 'យូធូប']):
            log_server_response(lang_responses['youtube'])
            return lang_responses['youtube']
        elif any(word in lower_message for word in ['promo', 'promotion', 'discount', 'ការផ្តល់ជូន', 'បញ្ចុះតម្លៃ']):
            log_server_response(lang_responses['promotions'])
            return lang_responses['promotions']
        
        # Default response
        response = {
            "action": "message",
            "message": lang_responses['default']
        }
        log_server_response(response)
        return response

# Create RPC server instance
rpc_server = ChatbotRPCServer()

@app.route('/rpc', methods=['POST'])
def handle_rpc():
    try:
        # Parse JSON-RPC request
        data = request.get_json()
        
        # Log the raw request
        print(f"\n[{get_current_time()}] RAW REQUEST RECEIVED:")
        print(data)
        
        # Validate JSON-RPC 2.0 request
        if not data or data.get('jsonrpc') != '2.0' or 'method' not in data:
            error_response = {
                "jsonrpc": "2.0",
                "error": {"code": -32600, "message": "Invalid Request"},
                "id": data.get('id', None)
            }
            print(f"[{get_current_time()}] ERROR RESPONSE:")
            print(error_response)
            return jsonify(error_response), 400
        
        method = data['method']
        params = data.get('params', {})
        request_id = data.get('id', None)
        
        # Process methods
        if method == 'processMessage':
            result = rpc_server.process_message(
                params.get('message', ''),
                params.get('language', 'en')
            )
            return jsonify({
                "jsonrpc": "2.0",
                "result": result,
                "id": request_id
            })
        else:
            error_response = {
                "jsonrpc": "2.0",
                "error": {"code": -32601, "message": "Method not found"},
                "id": request_id
            }
            print(f"[{get_current_time()}] ERROR RESPONSE:")
            print(error_response)
            return jsonify(error_response), 404
            
    except Exception as e:
        error_response = {
            "jsonrpc": "2.0",
            "error": {"code": -32603, "message": str(e)},
            "id": data.get('id', None)
        }
        print(f"[{get_current_time()}] EXCEPTION OCCURRED:")
        print(error_response)
        return jsonify(error_response), 500

if __name__ == '__main__':
    print("Starting Delicious Eats RPC Server...")
    print("Server is running on http://localhost:5002")
    print("Waiting for client requests...\n")
    app.run(debug=True, port=5002)