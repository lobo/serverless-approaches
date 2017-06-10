import argparse, requests, glob, os, time

# Parse arguments
parser = argparse.ArgumentParser(description='Image uploader.')
parser.add_argument('path', metavar='path', type=str, nargs=1, help='the path to the directory containing the JPG images')
parser.add_argument('url', metavar='url', type=str, nargs=1, help='the URL to POST the JPG images in the directory')
args = parser.parse_args()
url = args.url[0]
path = args.path[0]

bytes_uploaded = 0
files_count = 0
millis_start = int(round(time.time() * 1000))
millis_new_file_start = millis_start
all_files = glob.glob(path + '/*.jpg')
all_files_count = len(all_files)
print 'Upload started...'
for file_name in all_files:
    files = {'file': open(file_name, 'rb')}
    file_size = os.stat(file_name).st_size
    bytes_uploaded += file_size
    files_count += 1
    requests.post(url, files=files)
    millis_new_file_end = int(round(time.time() * 1000))
    millis_diff = millis_new_file_end - millis_new_file_start
    print 'Image ' + str(files_count) + ' of ' + str(all_files_count) + ' (' + str(file_size/1024) + ' KB) uploaded in ' + str(millis_diff/1000) + ' seconds.'
    millis_new_file_start = millis_new_file_end

millis_end = int(round(time.time() * 1000))
millis_total = millis_end - millis_start
print 'Upload finished. ' + str(files_count) + ' images (' + str(bytes_uploaded/1024) + ' KB) were uploaded in ' + str(millis_total/1000) + ' seconds.'
