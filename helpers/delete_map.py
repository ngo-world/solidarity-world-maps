#!/usr/bin/env python3
import requests

def get_env_file(filename: str) -> dict:
    with open(filename) as f:
        return {x.strip().split('=')[0]: x.strip().split('=')[1] for x in f.read().split('\n') if not x.strip().startswith('#') and x.strip() != ''}

def get_session(map_storage_api_key: str) -> requests.Session:
    s = requests.Session()
    s.headers = {
        'Authorization': f'Bearer {map_storage_api_key}'
    }
    return s

# https://docs.workadventu.re/developer/map-storage-api/#deleting-a-wam-file
def delete_map(*, session: requests.Session, map_storage_url: str, map_name: str):
    if not map_name.startswith('/'):
        map_name = '/' + map_name
    response = session.delete(f'{map_storage_url}{map_name}')
    response.raise_for_status()


def get_maps(session: requests.Session, map_storage_url: str) -> list:
    response = session.get(f'{map_storage_url}/maps')
    response.raise_for_status()
    return response.json()['maps']

env = {**get_env_file('.env'), **get_env_file('.env.secret')}
map_storage_url = env['MAP_STORAGE_URL']
map_storage_api_key = env['MAP_STORAGE_API_KEY']

session = get_session(map_storage_api_key=map_storage_api_key)
for map in get_maps(session=session, map_storage_url=map_storage_url):
    if input(f'Delete map "{map}"? Enter Y for yes: ').strip().lower().startswith('y'):
        delete_map(
            session=session,
            map_storage_url=map_storage_url,
            map_name=map
        )


