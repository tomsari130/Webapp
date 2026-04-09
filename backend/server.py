from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from bson import ObjectId


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Order Models
class OrderItem(BaseModel):
    id: str
    name: str
    price: float
    quantity: int

class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    customerName: str
    customerEmail: str
    customerPhone: str
    shippingAddress: str
    city: str
    state: str
    zipCode: str
    country: str
    items: List[OrderItem]
    total: float
    status: str = "pending"
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class OrderCreate(BaseModel):
    customerName: str
    customerEmail: str
    customerPhone: str
    shippingAddress: str
    city: str
    state: str
    zipCode: str
    country: str
    items: List[OrderItem]
    total: float

class OrderUpdate(BaseModel):
    status: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

# Order Management Endpoints
@api_router.post("/orders", response_model=dict)
async def create_order(order: OrderCreate):
    """Create a new order"""
    order_dict = order.model_dump()
    order_dict['status'] = 'pending'
    order_dict['createdAt'] = datetime.now(timezone.utc).isoformat()
    
    result = await db.orders.insert_one(order_dict)
    return {"id": str(result.inserted_id), "message": "Order created successfully"}

# Admin Endpoints
@api_router.get("/admin/orders")
async def get_all_orders():
    """Get all orders for admin"""
    orders = await db.orders.find().to_list(1000)
    
    # Convert ObjectId to string for JSON serialization
    for order in orders:
        order['_id'] = str(order['_id'])
        if isinstance(order.get('createdAt'), str):
            order['createdAt'] = datetime.fromisoformat(order['createdAt']).isoformat()
    
    return orders

@api_router.get("/admin/orders/{order_id}")
async def get_order(order_id: str):
    """Get a specific order"""
    try:
        order = await db.orders.find_one({"_id": ObjectId(order_id)})
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        order['_id'] = str(order['_id'])
        return order
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.patch("/admin/orders/{order_id}")
async def update_order_status(order_id: str, update: OrderUpdate):
    """Update order status"""
    try:
        result = await db.orders.update_one(
            {"_id": ObjectId(order_id)},
            {"$set": {"status": update.status}}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Order not found")
        
        return {"message": "Order updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.delete("/admin/orders/{order_id}")
async def delete_order(order_id: str):
    """Delete an order"""
    try:
        result = await db.orders.delete_one({"_id": ObjectId(order_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Order not found")
        
        return {"message": "Order deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()