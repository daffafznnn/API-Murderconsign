import UsersRepository from "../repositories/implementations/UsersRepository.js";
import removeSensitiveFields from "../utils/removeSensitiveFields.js";
import bcryptjs from "bcryptjs";
import upload from "../utils/fileUpload.js";
import fs from "fs";
import path from "path";

const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Failed to delete file:", err);
    }
  });
};

class UsersService {
  async findAllUser() {
    const users = await UsersRepository.findAll();
    return { message: "Successfully get all user data", users };
  }

  async findUserById(userId) {
    const user = await UsersRepository.findByUserId(userId);
    if (!user) {
      throw { statusCode: 404, message: "User not Found" };
    }
    return {
      message: "Successfully get user data",
      user: removeSensitiveFields(user),
    };
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
      url_profilePicture: file
        ? path.join("profile-picture", file.filename)
        : null, // URL foto profil
      image: file ? file.filename : null, // Nama file foto profil
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
      url_profilePicture: file
        ? path.join("profile-picture", file.filename)
        : findUser.url_profilePicture, // URL foto profil baru atau yang lama
      image: file ? file.filename : findUser.image, // Nama file foto profil baru atau yang lama
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

  async deleteUser(userIds) {
    const results = await Promise.all(
      userIds.map(async (userId) => {
        const findUser = await UsersRepository.findByUserId(userId);
        if (!findUser) {
          return {
            statusCode: 404,
            message: `User with ID ${userId} not found`,
          };
        }
        await UsersRepository.delete(userId);
        return {
          statusCode: 200,
          message: `User with ID ${userId} successfully deleted`,
        };
      })
    );

    // Check if there were any errors
    const errors = results.filter((result) => result.statusCode !== 200);
    if (errors.length > 0) {
      throw errors[0]; // Throw the first error encountered
    }

    return { statusCode: 200, message: "Users successfully deleted" };
  }

  async changeStatus(userData) {
    const { userId, status } = userData;

    const findUser = await UsersRepository.findByUserId(userId);
    if (!findUser) {
      throw { statusCode: 404, message: "User not Found" };
    }

    const user = {
      status,
    };

    await UsersRepository.update(user);

    return {
      statusCode: 200,
      message: `user ${findUser.username} has had its status updated`,
    };
  }
}

export default new UsersService();