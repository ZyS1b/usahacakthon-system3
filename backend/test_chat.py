import sys
import os

# Add project root to path so backend.routers imports work
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

all_passed = True

def test(name, fn):
    global all_passed
    try:
        fn()
        print(f'  PASS: {name}')
    except Exception as e:
        print(f'  FAIL: {name} - {e}')
        all_passed = False

def test_valid_english():
    resp = client.post('/api/chat', json={
        'message': 'What is 4Ps?',
        'history': [],
        'language': 'en'
    })
    assert resp.status_code == 200, f'Expected 200, got {resp.status_code}'
    data = resp.json()
    assert 'reply' in data, 'Missing "reply" in response'
    assert len(data['reply']) > 20, f'Reply too short: {len(data["reply"])} chars'
    assert data.get('error') is None or data.get('error') == '', f'Unexpected error: {data.get("error")}'

def test_valid_filipino():
    resp = client.post('/api/chat', json={
        'message': 'Ano ang TUPAD?',
        'history': [],
        'language': 'fil'
    })
    assert resp.status_code == 200, f'Expected 200, got {resp.status_code}'
    data = resp.json()
    assert 'reply' in data
    assert len(data['reply']) > 20, f'Reply too short: {len(data["reply"])} chars'

def test_empty_message_rejected():
    resp = client.post('/api/chat', json={
        'message': '',
        'history': [],
        'language': 'en'
    })
    assert resp.status_code == 422, f'Expected 422, got {resp.status_code}'

def test_whitespace_message_rejected():
    resp = client.post('/api/chat', json={
        'message': '   \t  ',
        'history': [],
        'language': 'en'
    })
    assert resp.status_code == 422, f'Expected 422, got {resp.status_code}'

def test_with_history():
    resp = client.post('/api/chat', json={
        'message': 'Tell me more',
        'history': [
            {'role': 'user', 'content': 'What is 4Ps?'},
            {'role': 'assistant', 'content': '4Ps is a cash transfer program for poor families.'}
        ],
        'language': 'en'
    })
    assert resp.status_code == 200, f'Expected 200, got {resp.status_code}'
    data = resp.json()
    assert 'reply' in data and len(data['reply']) > 20

def test_overlong_message_rejected():
    long_msg = 'X' * 5000
    resp = client.post('/api/chat', json={
        'message': long_msg,
        'history': [],
        'language': 'en'
    })
    assert resp.status_code == 422, f'Expected 422, got {resp.status_code}'

def test_missing_language_defaults_ok():
    resp = client.post('/api/chat', json={
        'message': 'What is PhilHealth?',
        'history': []
    })
    assert resp.status_code == 200, f'Expected 200, got {resp.status_code}'
    data = resp.json()
    assert 'reply' in data and len(data['reply']) > 20

def test_response_structure():
    resp = client.post('/api/chat', json={
        'message': 'Hi',
        'history': [],
        'language': 'en'
    })
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, dict)
    assert 'reply' in data
    assert isinstance(data['reply'], str)

print('=== TulongAI Chat Endpoint Test Suite ===')
print()

test('Valid English query', test_valid_english)
test('Valid Filipino query', test_valid_filipino)
test('Empty message returns 422', test_empty_message_rejected)
test('Whitespace-only message returns 422', test_whitespace_message_rejected)
test('Conversation with history works', test_with_history)
test('Overlong message (>2000 chars) returns 422', test_overlong_message_rejected)
test('Missing language field defaults to English', test_missing_language_defaults_ok)
test('Response has correct structure', test_response_structure)

print()
if all_passed:
    print('ALL TESTS PASSED')
else:
    print('SOME TESTS FAILED')
    sys.exit(1)