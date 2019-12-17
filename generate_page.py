import urllib.request
import json
from helpers import *
import pickle
from jinja2 import Template
from collections import OrderedDict

github_username = 'mmulcahy222'
client_id = ''
client_secret = ''
use_serialized = False

repos = ['google_home_youtube', 'google_home_audiobooks', 'alexa_number_guess', 'helper_functions', 'alexa_hangman', 'alexa_weather', 'alexa_feed', 'regex_data_lake', 'socket_network_automation', 'netflow', 'google_bookmarks', 'google_street_view', 'instagram_private', 'iterate_youtube', 'blue_sage_creek', 'laptops', 'netconf', 'nimli_2011', 'news_reader', 'redsox', 'wordpress_repo', 'youtube_comments', 'miscellaneous', 'ebay_pictures_repo', 'google_maps_popular_times']

def http_request(url,headers={}):
	url += f"?client_id={client_id}&client_secret={client_secret}"
	req = urllib.request.Request(url, headers=headers)
	response = urllib.request.urlopen(req)
	return response.read().decode()	

def get_description(repository_name):
	response = http_request(f"https://api.github.com/repos/{github_username}/{repository_name}")
	response = json.loads(response)
	return response['description']

def get_repository_readme_html(repository_name):
	return http_request(f"https://api.github.com/repos/{github_username}/{repository_name}/readme", headers={'User-Agent':'PHP','Accept':'application/vnd.github.v3.html'})

def get_repository_info_json(repository_name):
	#get "sha" for request after this one
	response = http_request(f"https://api.github.com/repos/{github_username}/{repository_name}/branches/master")
	response = json.loads(response)
	sha = response['commit']['commit']['tree']['sha']
	response = http_request(f"https://api.github.com/repos/{github_username}/{repository_name}/git/trees/{sha}")
	response = json.loads(response)
	return response

def generate_table_html(repository_name):
	table_html = "<table><tbody>"
	repository_info_json = get_repository_info_json(repository_name)
	for repository_item in repository_info_json['tree']:
		table_html += '<tr><td>'
		repository_item_name = repository_item['path']
		github_url = f"https://github.com/{github_username}/{repository_name}/blob/master/{repository_item_name}"
		raw_github_url = f"https://raw.githubusercontent.com/{github_username}/{repository_name}/master/{repository_item_name}"
		table_html += '<div class="file_name"><a href="{}">{}</a></div>'.format(github_url,repository_item_name)
		if repository_item['type'] == 'blob':
			table_html += '<div class="raw_link"><a href="{}target="_blank">Raw</a></div>'.format(raw_github_url)
		else:
			table_html += '<div class="raw_link"><a href="{}"target="_blank">Github Link</a></div>'.format(github_url)
		table_html += "</td></tr>"
	table_html += "</tbody></table>"
	return table_html

def use_github_api_serialize():
	'''
	Actually call GITHUB API, and serialize (aka pickle) in a dict
	Call this when you need to update the page
	'''
	jinja_dict = OrderedDict()
	for repository_name in repos:
		jinja_dict[repository_name] = {
				'repository_name':repository_name,
				'description':get_description(repository_name),
				'github_html':generate_table_html(repository_name),
				'readme_html':get_repository_readme_html(repository_name)
			}
		print(f"Getting Data for {repository_name}")
	pickle.dump(jinja_dict,open("jinja_dict.p","wb"))
	return jinja_dict

if __name__ == '__main__':
	if use_serialized == False:
		jinja_dict = use_github_api_serialize()
	else:
		#most of the time you will be here
		jinja_dict = pickle.load(open("jinja_dict.p","rb"))
	template = Template(file_get_contents('index_template.j2'))
	html = template.render(**locals())
	print(html)
	file_put_contents('index.php',html)


