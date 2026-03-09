#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import requests
import random
import string
import os

BASE = 'http://localhost:8080'

# support helper functions

def rand(n=6):
    return ''.join(random.choice(string.ascii_lowercase) for _ in range(n))


def get_csrf(session):
    r = session.get(f"{BASE}/csrf")
    r.raise_for_status()
    return r.json().get('token')


def register(session, username, password, email):
    url = BASE + '/api/register'
    token = get_csrf(session)
    payload = {
        'username': username,
        'password': password,
        'email': email,
        'firstName': 'E2E',
        'lastName': 'Test'
    }
    headers = {'X-XSRF-TOKEN': token}
    r = session.post(url, json=payload, headers=headers)
    try:
        print('Register:', r.status_code, r.json())
    except Exception:
        print('Register:', r.status_code, r.text)
    return r.status_code


def login(session, username, password):
    url = BASE + '/api/login'
    token = get_csrf(session)
    r = session.post(url, json={'username': username, 'password': password}, headers={'X-XSRF-TOKEN': token})
    try:
        print('Login:', r.status_code, r.json())
    except Exception:
        print('Login:', r.status_code, r.text)
    return r.status_code


def upload_metadata(session, filepath, name=None):
    url = BASE + '/api/saml/import'
    token = get_csrf(session)
    files = {'file': (os.path.basename(filepath), open(filepath, 'rb'), 'application/xml')}
    data = {}
    if name:
        data['name'] = name
    r = session.post(url, files=files, data=data, headers={'X-XSRF-TOKEN': token})
    try:
        print('Upload:', r.status_code, r.json())
    except Exception:
        print('Upload:', r.status_code, r.text)
    return r

def main():
    s = requests.Session()
    username = 'e2e_saml_' + rand(6)
    password = 'TestPass123!'
    email = username + '@example.local'

    # Try to register (may already exist)
    register(s, username, password, email)
    # Login
    code = login(s, username, password)
    if code != 200:
        print('Login failed; aborting upload')
        return

    # Upload sample metadata shipped in repo
    sample = os.path.join('src', 'main', 'resources', 'static', 'samples', 'sample-metadata.xml')
    if not os.path.exists(sample):
        print('Sample metadata file not found at', sample)
        return
    upload_metadata(s, sample, name='E2E Sample IDP')

if __name__ == '__main__':
    main()
