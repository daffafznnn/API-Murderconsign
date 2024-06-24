import UsersService from "../../../services/UsersService.js";

class UsersController {
  async getAllUser(req, res) {
    try {
      const result = await UsersService.findAllUser();
      return res.status(200).json({
        status: "success",
        message: result.message,
        data: result.users,
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async getUserById(req, res) {
    const { userId } = req.params;
    try {
      const result = await UsersService.findUserById(userId);
      return res.status(200).json({
        status: "success",
        message: result.message,
        data: result.user,
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async createUser(userData) {
    const {
      username,
      email,
      fullName,
      password,
      confPassword,
      role,
      status,
      phoneNumber,
      image,
      url_profilePicture,
      preferences,
      gender,
      dateOfBirth,
    } = userData;

    if (!username || !email || !fullName || !password || !confPassword) {
      throw { statusCode: 400, message: "All fields are required" };
    }

    if (password !== confPassword) {
      throw { statusCode: 400, message: "Passwords do not match" };
    }

    const salt = await bcryptjs.genSalt();
    const hashedPassword = await bcryptjs.hash(password, salt);

    const user = {
      username,
      email,
      fullName,
      password: hashedPassword,
      role,
      status,
      phoneNumber,
      image,
      url_profilePicture,
      preferences,
      gender,
      dateOfBirth,
    };

    const createdUser = await UsersRepository.create(user);

    return {
      message: "User successfully created",
      data: removeSensitiveFields(createdUser),
    };
  }

  async updateUser(userData) {
    const {
      userId,
      username,
      email,
      password,
      confPassword,
      role,
      status,
      phoneNumber,
      image,
      url_profilePicture,
      preferences,
      gender,
      dateOfBirth,
    } = userData;

    const findUser = await UsersRepository.findByUserId(userId);
    if (!findUser) {
      throw { statusCode: 404, message: "User not Found" };
    }

    if (password !== confPassword) {
      throw { statusCode: 400, message: "Passwords do not match" };
    }

    const salt = await bcryptjs.genSalt();
    const hashedPassword = await bcryptjs.hash(password, salt);

    const user = {
      username,
      email,
      password: hashedPassword,
      role,
      status,
      phoneNumber,
      image,
      url_profilePicture,
      preferences,
      gender,
      dateOfBirth,
    };

    const updatedUser = await UsersRepository.update(userId, user);

    return {
      message: "User updated successfully",
      data: removeSensitiveFields(updatedUser),
    };
  }

  async deleteUser(req, res) {
    const { userIds } = req.query; // Menggunakan req.query untuk mengambil array userIds dari query params
    try {
      // Memastikan userIds adalah array
      if (!Array.isArray(userIds) || userIds.length === 0) {
        throw {
          statusCode: 400,
          message: "UserIds must be a non-empty array in query parameters",
        };
      }

      const result = await UsersService.deleteUser(userIds);

      return res.status(result.statusCode).json({
        status: "success",
        message: result.message,
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async changeStatus(req, res) {
    const userData = req.body;
    try {
      const result = await UsersService.changeStatus(userData);
      return res.status(200).json({
        status: "success",
        message: result.message,
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        status: "error",
        message: error.message,
      });
    }
  }
}

export default new UsersController();