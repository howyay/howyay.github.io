import sys
def toYaml(filename):
    with open(f"./{filename}", 'r') as file:
        for line in file:
            print(f"- text: \"{line.strip()}\"")
            print(f"  <<: *default_question")

print(sys.argv[1])
toYaml(sys.argv[1])
