import User from "@/domain/User/Entities/User";

export type UserPresentation = {
  id: string;
  name: string;
};

class UserPresenter {
  single(user: User): UserPresentation {
    return {
      id: user.id,
      name: user.name,
    };
  }
}

export default UserPresenter;
