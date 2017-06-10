import argparse, requests, glob, os, time, urllib

# Parse arguments
parser = argparse.ArgumentParser(description='Node.js image resizer tester.')
parser.add_argument('path', metavar='path', type=str, nargs=1, help='the path to the directory containing the sample JPG images')
parser.add_argument('url', metavar='url', type=str, nargs=1, help='the URL where is the service running')
parser.add_argument('width', metavar='width', type=str, nargs=1, help='the width of the resulting resized image')
parser.add_argument('height', metavar='height', type=str, nargs=1, help='the height of the resulting resized image')
args = parser.parse_args()
url = args.url[0]
path = args.path[0]
width = args.width[0]
height = args.height[0]

bytes_downloaded = 0
files_count = 0
millis_start = int(round(time.time() * 1000))
millis_new_file_start = millis_start
all_files = glob.glob(path + '/*.jpg')
all_files_count = len(all_files)
print 'Test started...'
for file_name in all_files:
    url += '/images/' + width + 'x' + height + '/' + os.path.abspath(file_name)
    f = urllib.urlopen(link)
    myfile = f.read()
    f.seek(0, os.SEEK_END)
    file_size = f.tell()
    f.close()
    bytes_downloaded += file_size
    files_count += 1
    millis_new_file_end = int(round(time.time() * 1000))
    millis_diff = millis_new_file_end - millis_new_file_start
    print 'Image ' + str(files_count) + ' of ' + str(all_files_count) + ' (' + str(file_size/1024) + ' KB) downloaded in ' + str(millis_diff/1000) + ' seconds.'
    millis_new_file_start = millis_new_file_end

millis_end = int(round(time.time() * 1000))
millis_total = millis_end - millis_start
print 'Test finished. ' + str(files_count) + ' images (' + str(bytes_uploaded/1024) + ' KB) were downloaded in ' + str(millis_total/1000) + ' seconds.'
