import itertools

path = 'app.log'
with open(path, 'r', encoding='utf-8', errors='ignore') as f:
    lines = f.readlines()
print('Total lines', len(lines))
print('--- last 60 lines ---')
for l in lines[-60:]:
    print(l.rstrip())
