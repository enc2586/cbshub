import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

info_version = 2023

cred = credentials.Certificate('python/serviceAccountKey.json')
firebase_admin.initialize_app(cred)

db = firestore.client()

users = db.collection("user").stream()

for user_doc in users:
    user_doc.reference.update({"infoVersion": info_version})
    user_doc.reference.update({"sid_ver": firestore.DELETE_FIELD})
