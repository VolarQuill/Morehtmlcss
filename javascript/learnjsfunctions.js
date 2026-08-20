function greetUser(username) {
    console.log("Hello " + username)
}

greetUser('John')
greetUser('Alex')
greetUser('Thomas')
greetUser('Jim')

function addNumbers(num1, num2){
    return num1 + num2
}

let result = addNumbers(6, 7)
console.log(result)

let technologies = ["HTML", "CSS", "JS", ]
    technologies.push("REACT")
    technologies.push('GODOT')
    technologies.pop()
    console.log(technologies[3])

let users = ["JOHN", "SUSAN", "THOMAS", "ALEX"]

function login(user) {
    users.push(user)
}

login("MARK")
login("JESSE")
console.log(users)

let user = {
    name: "john",
    age: 20,
    isStudent: true
}

console.log(user.age)