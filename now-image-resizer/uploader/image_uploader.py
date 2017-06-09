import argparse, requests, glob, os

# Parse arguments
parser = argparse.ArgumentParser(description='Image uploader.')
parser.add_argument('url', metavar='url', type=str, nargs=1, help='the URL to POST the JPG images in the current directory')
args = parser.parse_args()
url = args.url[0]

for file_name in glob.glob(os.getcwd() + '/*.jpg'):
    files = {'file': open(file_name, 'rb')}
    requests.post(url, files=files)
