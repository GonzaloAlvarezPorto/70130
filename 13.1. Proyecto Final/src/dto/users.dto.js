class UserDTO {
    constructor(user) {
        this.id = user._id || user.id;
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.full_name = user.full_name || `${user.first_name} ${user.last_name}`;
        this.email = user.email;
        this.age = user.age;
        this.role = user.role;
    }
}

module.exports = UserDTO;