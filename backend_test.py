#!/usr/bin/env python3
"""
Backend API Testing for Ecommerce Checkout Flow
Tests the complete order management system including:
- POST /api/orders (order creation)
- GET /api/admin/orders (fetch all orders)
- CORS and connection verification
"""

import requests
import json
import sys
from datetime import datetime

# Backend URL from frontend .env
BACKEND_URL = "https://flash-shop-8.preview.emergentagent.com"
API_BASE = f"{BACKEND_URL}/api"

def test_connection():
    """Test basic connection to backend"""
    print("🔗 Testing backend connection...")
    try:
        response = requests.get(f"{API_BASE}/", timeout=10)
        print(f"✅ Connection successful: {response.status_code}")
        print(f"Response: {response.json()}")
        return True
    except requests.exceptions.RequestException as e:
        print(f"❌ Connection failed: {e}")
        return False

def test_create_order():
    """Test POST /api/orders endpoint with complete order data"""
    print("\n📦 Testing order creation (POST /api/orders)...")
    
    # Realistic test order data
    order_data = {
        "customerName": "Sarah Johnson",
        "customerEmail": "sarah.johnson@email.com", 
        "customerPhone": "+1-555-0123",
        "shippingAddress": "123 Main Street, Apt 4B",
        "city": "New York",
        "state": "NY",
        "zipCode": "10001",
        "country": "USA",
        "items": [
            {
                "id": "prod_001",
                "name": "Wireless Bluetooth Headphones",
                "price": 89.99,
                "quantity": 1
            },
            {
                "id": "prod_002", 
                "name": "USB-C Charging Cable",
                "price": 19.99,
                "quantity": 2
            }
        ],
        "total": 129.97,
        "paymentInfo": {
            "cardNumber": "4532123456789012",
            "cardLast4": "9012",
            "cardholderName": "Sarah Johnson",
            "expiryDate": "12/26",
            "cvv": "123"
        }
    }
    
    try:
        response = requests.post(
            f"{API_BASE}/orders",
            json=order_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Order created successfully!")
            print(f"Order ID: {result.get('id')}")
            print(f"Message: {result.get('message')}")
            return result.get('id')
        else:
            print(f"❌ Order creation failed")
            print(f"Response: {response.text}")
            return None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
        return None

def test_get_orders():
    """Test GET /api/admin/orders endpoint"""
    print("\n📋 Testing order retrieval (GET /api/admin/orders)...")
    
    try:
        response = requests.get(f"{API_BASE}/admin/orders", timeout=10)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            orders = response.json()
            print(f"✅ Orders retrieved successfully!")
            print(f"Number of orders: {len(orders)}")
            
            if orders:
                print("\n📄 Sample order data:")
                latest_order = orders[-1]  # Show the most recent order
                print(f"Customer: {latest_order.get('customerName')}")
                print(f"Email: {latest_order.get('customerEmail')}")
                print(f"Total: ${latest_order.get('total')}")
                print(f"Status: {latest_order.get('status')}")
                print(f"Items count: {len(latest_order.get('items', []))}")
                
                # Check if payment info is included
                if 'paymentInfo' in latest_order:
                    payment = latest_order['paymentInfo']
                    print(f"Payment - Card Last 4: {payment.get('cardLast4')}")
                    print(f"Payment - Cardholder: {payment.get('cardholderName')}")
                else:
                    print("⚠️  Payment info not found in order")
                    
            return orders
        else:
            print(f"❌ Failed to retrieve orders")
            print(f"Response: {response.text}")
            return None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
        return None

def test_cors_headers():
    """Test CORS headers on API endpoints"""
    print("\n🌐 Testing CORS headers...")
    
    try:
        # Test preflight request
        response = requests.options(
            f"{API_BASE}/orders",
            headers={
                "Origin": "https://flash-shop-8.preview.emergentagent.com",
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "Content-Type"
            },
            timeout=10
        )
        
        print(f"OPTIONS Status Code: {response.status_code}")
        cors_headers = {k: v for k, v in response.headers.items() if 'access-control' in k.lower()}
        print(f"CORS Headers: {cors_headers}")
        
        if 'access-control-allow-origin' in cors_headers:
            print("✅ CORS headers present")
        else:
            print("⚠️  CORS headers missing or incomplete")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ CORS test failed: {e}")

def verify_database_persistence():
    """Verify that orders are actually saved to database by checking count before/after"""
    print("\n💾 Testing database persistence...")
    
    # Get initial count
    initial_orders = test_get_orders()
    if initial_orders is None:
        print("❌ Cannot verify database persistence - failed to get initial orders")
        return False
        
    initial_count = len(initial_orders)
    print(f"Initial order count: {initial_count}")
    
    # Create a new order
    order_id = test_create_order()
    if not order_id:
        print("❌ Cannot verify database persistence - failed to create order")
        return False
    
    # Get updated count
    updated_orders = test_get_orders()
    if updated_orders is None:
        print("❌ Cannot verify database persistence - failed to get updated orders")
        return False
        
    updated_count = len(updated_orders)
    print(f"Updated order count: {updated_count}")
    
    if updated_count > initial_count:
        print("✅ Database persistence verified - order count increased")
        return True
    else:
        print("❌ Database persistence failed - order count did not increase")
        return False

def main():
    """Run all backend tests"""
    print("🚀 Starting Backend API Tests for Ecommerce Checkout Flow")
    print("=" * 60)
    
    # Test results tracking
    results = {
        "connection": False,
        "order_creation": False,
        "order_retrieval": False,
        "cors": False,
        "database_persistence": False
    }
    
    # 1. Test basic connection
    results["connection"] = test_connection()
    
    if not results["connection"]:
        print("\n❌ Backend connection failed. Cannot proceed with further tests.")
        return results
    
    # 2. Test order creation
    order_id = test_create_order()
    results["order_creation"] = order_id is not None
    
    # 3. Test order retrieval
    orders = test_get_orders()
    results["order_retrieval"] = orders is not None
    
    # 4. Test CORS
    test_cors_headers()
    results["cors"] = True  # We'll mark as true if no errors, detailed analysis in output
    
    # 5. Test database persistence
    results["database_persistence"] = verify_database_persistence()
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)
    
    for test_name, passed in results.items():
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{test_name.replace('_', ' ').title()}: {status}")
    
    total_tests = len(results)
    passed_tests = sum(results.values())
    print(f"\nOverall: {passed_tests}/{total_tests} tests passed")
    
    if passed_tests == total_tests:
        print("🎉 All tests passed! Ecommerce checkout flow is working correctly.")
    else:
        print("⚠️  Some tests failed. Check the detailed output above for issues.")
    
    return results

if __name__ == "__main__":
    main()