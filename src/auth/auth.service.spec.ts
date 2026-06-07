import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

const mockUsersService = {
  findByEmail: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mocked-jwt-token'),
};

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user and return an access token', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue({
        id: 'user-id',
        email: 'test@test.com',
      });

      const result = await authService.register({
        email: 'test@test.com',
        password: 'haslo123',
        firstName: 'Jan',
        lastName: 'Kowalski',
      });

      expect(result).toEqual({ access_token: 'mocked-jwt-token' });
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(
        'test@test.com',
      );
      expect(mockUsersService.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if email is already in use', async () => {
      mockUsersService.findByEmail.mockResolvedValue({
        id: 'user-id',
        email: 'test@test.com',
      });

      await expect(
        authService.register({
          email: 'test@test.com',
          password: 'haslo123',
          firstName: 'Jan',
          lastName: 'Kowalski',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should login a user and return an access token', async () => {
      const hashedPassword = await bcrypt.hash('haslo123', 10);
      mockUsersService.findByEmail.mockResolvedValue({
        id: 'user-id',
        email: 'test@test.com',
        password: hashedPassword,
      });

      const result = await authService.login({
        email: 'test@test.com',
        password: 'haslo123',
      });

      expect(result).toEqual({ access_token: 'mocked-jwt-token' });
    });

    it('it should throw UnauthorizedException if user is not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(
        authService.login({
          email: 'test@test.com',
          password: 'haslo123',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const hashedPassword = await bcrypt.hash('haslo123', 10);
      mockUsersService.findByEmail.mockResolvedValue({
        id: 'user-id',
        email: 'test@test.com',
        password: hashedPassword,
      });

      await expect(
        authService.login({
          email: 'test@test.com',
          password: 'wrongpassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getMe', () => {
    it('should return user data without password', async () => {
      mockUsersService.findById.mockResolvedValue({
        id: 'user-id',
        email: 'test@test.com',
        password: 'hashedpassword',
        firstName: 'Jan',
        lastName: 'Kowalski',
      });

      const result = await authService.getMe('user-id');

      expect(result).not.toHaveProperty('password');
      expect(result).toEqual({
        id: 'user-id',
        email: 'test@test.com',
        firstName: 'Jan',
        lastName: 'Kowalski',
      });
    });
  });
});
