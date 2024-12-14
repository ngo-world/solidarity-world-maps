#!/usr/bin/env python3
import requests

def get_env_file(filename: str) -> dict:
    with open(filename) as f:
        return {x.strip().split('=')[0]: x.strip().split('=')[1] for x in f.read().split('\n') if not x.strip().startswith('#') and x.strip() != ''}

def delete_map(*, map_storage_url: str, map_name: str, map_storage_api_key: str):
    response = requests.delete(f'{map_storage_url}{map_name}', headers={
        'Authorization': f'Bearer {map_storage_api_key}'
    })
    response.raise_for_status()

env = {**get_env_file('.env'), **get_env_file('.env.secret')}
map_storage_url = env['MAP_STORAGE_URL']
map_storage_api_key = env['MAP_STORAGE_API_KEY']

for map_name in ['/dist/conference.wam', 'dist/office.wam']:
    delete_map(
        map_storage_url=map_storage_url,
        map_storage_api_key=map_storage_api_key,
        map_name=map_name
    )
