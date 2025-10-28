import {validate} from 'class-validator';
import {CreateUserDto} from './create-user.dto';

describe('createUserDto', () => {
  let dto = new CreateUserDto();

  beforeEach(() => {
    dto = new CreateUserDto();
    dto.email = 'ta78296@gmail.com';
    dto.name = 'Tanveer';
    dto.password = '12345678A$';
  });
  it('should validate complete valid data', async () => {
    const errors = await validate(dto);
    //Assert
    expect(errors.length).toBe(0);
  });

  it('should fail on invalid email', async () => {
    dto.email = 'test';
    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });
  // Specific requirements for Test the password.
  /*
  1:    At least 1 uppercase letter,
  2:    At least 1 number,
  3:    At least 1 special character
  */
  it('should fail without 1 uppercase letter', async () => {
    dto.password = 'abcdefgh';
    const errors = await validate(dto);
    const passwordErrror = errors.find(
      (error) => error.property === 'password'
    );
    expect(passwordErrror).not.toBeUndefined();
    const messages = Object.values(passwordErrror?.constraints ?? {});
    expect(messages).toContain(
      'password must be contain at least 1 uppercase letter'
    );
  });
});
