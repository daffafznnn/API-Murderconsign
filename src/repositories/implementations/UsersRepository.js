import IUsersRepository from "../interfaces/IUsersRepository.js";
import User from "../../models/UsersModel.js";

class UserRepository extends IUsersRepository {
  async create(user) {
    return await User.create(user);
  }

  async findAll() {
    return await User.findAll({
      attributes: ["username", "email", "password", "role", "status"],
      order: [["createdAt", "DESC"]],
    });
  }

  async findByUserEmail(email) {
    return await User.findOne({ where: { email } });
  }

  async findByUserId(userId) {
    return await User.findByPk(userId);
  }

  async update(user) {
    const { id, ...userData } = user;
    return await User.update(userData, { where: { id } });
  }

  async delete(userIds) {
    return User.destroy({ where: { id: userIds } });
  }
}

export default new UserRepository();