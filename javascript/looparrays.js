let names = ['SUSAN', 'MARK', 'JESSE']

for (let i = 0; i < names.length; i++) {
    console.log(names[i])
}

names.forEach(printName)

function printName(name) {
    console.log("My name is " + name)
}