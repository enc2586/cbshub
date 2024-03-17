import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

sid_ver = 2024

cred = credentials.Certificate('python/serviceAccountKey.json')
firebase_admin.initialize_app(cred)

db = firestore.client()

users = db.collection("user").stream()

for user_doc in users:
    user_doc.reference.update({"sid_ver": sid_ver})
