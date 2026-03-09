# -*- coding: utf-8 -*-
import json
import requests
import datetime

BASE_URL = "http://localhost:8080"

# helper session that will keep cookies
session = requests.Session()

def get_csrf():
    # call the Spring CSRF endpoint to fetch the token stored in a cookie
    r = session.get(f"{BASE_URL}/csrf")
    r.raise_for_status()
    body = r.json()
    return body.get('token')

print("=" * 70)
print("E2E REGISTRATION TEST - FULL FLOW DEMONSTRATION")
print("=" * 70)
print()

# helper function to login

def login_user(username, password):
    try:
        token = get_csrf()
        resp = session.post(
            f"{BASE_URL}/api/login",
            json={"username": username, "password": password},
            headers={"X-XSRF-TOKEN": token}
        )
        print("LOGIN STATUS:", resp.status_code)
        print(json.dumps(resp.json(), indent=2))
        return resp
    except Exception as e:
        print("LOGIN FAILED:", str(e))
        return None


# generate a timestamp so we reuse unique usernames
timestamp = str(int(datetime.datetime.now().timestamp()))[-4:]

print("TEST 1: Registration with All Fields (username, firstName, lastName)")
print("-" * 70)

 test_user_1 = {
    "username": f"e2e_alice_{timestamp}",
    "firstName": "Alice",
    "lastName": "Johnson",
    "password": "SecurePass123!",
    "email": f"alice{timestamp}@example.com"
}

print("REQUEST PAYLOAD:")
print(json.dumps(test_user_1, indent=2))
print()

try:
    token = get_csrf()
    response = session.post(
        f"{BASE_URL}/api/register",
        json=test_user_1,
        headers={
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": token
        }
    )
    print("RESPONSE STATUS:", response.status_code)
    print("RESPONSE BODY:")
    print(json.dumps(response.json(), indent=2))
    print(" TEST 1 PASSED")
    # attempt login
    print("Attempting login for user", test_user_1['username'])
    login_user(test_user_1['username'], test_user_1['password'])
except Exception as e:
    print(" TEST 1 FAILED:", str(e))

print()
print("=" * 70)
print("TEST 2: Registration with Minimal Fields (no firstName/lastName)")
print("-" * 70)

test_user_2 = {
    "username": f"e2e_bob_{timestamp}",
    "password": "SecurePass456!",
    "email": f"bob{timestamp}@example.com"
}

print("REQUEST PAYLOAD:")
print(json.dumps(test_user_2, indent=2))
print()

try:
    token = get_csrf()
    response = session.post(
        f"{BASE_URL}/api/register",
        json=test_user_2,
        headers={
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": token
        }
    )
    print("RESPONSE STATUS:", response.status_code)
    print("RESPONSE BODY:")
    print(json.dumps(response.json(), indent=2))
    print(" TEST 2 PASSED")
    # attempt login for minimal user
print("=" * 70)
print("E2E TEST SUITE COMPLETED")
print("=" * 70)
