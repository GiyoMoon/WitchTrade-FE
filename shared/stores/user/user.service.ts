import { UserStore, userStore } from './user.store';
import jwt_decode from 'jwt-decode';
import dayjs from 'dayjs';
import { fromFetch } from 'rxjs/fetch';
import { tap } from 'rxjs/operators';
import { userQuery, UserQuery } from './user.query';
import { of } from 'rxjs';
import { createUser, DecodedToken, RegisterUser, User } from './user.model';
import { inventoryService, InventoryService } from '../inventory/inventory.service';
import { createNotification } from '../notification/notification.model';
import { notificationService } from '../notification/notification.service';

export class UserService {

  constructor(private userStore: UserStore, private _userQuery: UserQuery, private _inventoryService: InventoryService) { }

  public async init() {
    const token = localStorage.getItem('jwt') ? localStorage.getItem('jwt') : sessionStorage.getItem('jwt');
    if (!token) {
      const user = createUser({ loggedIn: false });
      this.userStore.update(user);
      return;
    };

    // Decode token and check if it's still valid
    const decodedToken = jwt_decode<DecodedToken>(token);
    if (dayjs().isAfter(dayjs.unix(decodedToken.exp))) {
      localStorage.removeItem('jwt');
      sessionStorage.removeItem('jwt');
      this.userStore.reset();
      return;
    }

    // fetch additional information from the server and add it to the user object
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/users/current`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    const json = await res.json();

    const user = createUser(json);
    user.loggedIn = true;
    user.token = token;

    // update the store with the new user information
    this.userStore.update(user);
  }

  public login(username: string, password: string, stayLoggedIn: boolean) {
    const body = JSON.stringify({ username, password });
    // login user and save info to store
    return fromFetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/users/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body
      }).pipe(
        tap({
          next: async res => {
            const json = await res.json();
            if (res.ok) {
              const user = createUser(json);
              user.loggedIn = true;
              this.userStore.update(user);
              if (stayLoggedIn) {
                localStorage.setItem('jwt', user.token);
              } else {
                sessionStorage.setItem('jwt', user.token);
              }

              const notification = createNotification({
                content: `Logged in as ${json.username}`,
                duration: 5000,
                type: 'success'
              });
              notificationService.addNotification(notification);
            } else {
              const notification = createNotification({
                content: json.message,
                duration: 5000,
                type: 'error'
              });
              notificationService.addNotification(notification);
            }
          },
          error: err => {
            const notification = createNotification({
              content: err,
              duration: 5000,
              type: 'error'
            });
            notificationService.addNotification(notification);
            return of(err);
          }
        })
      );
  }

  public register(user: RegisterUser) {
    // login user and save info to store
    return fromFetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    }).pipe(
      tap({
        next: async res => {
          const json = await res.json();
          if (res.ok) {
            const user = createUser(json);
            user.loggedIn = true;
            this.userStore.update(user);
            sessionStorage.setItem('jwt', user.token);

            const notification = createNotification({
              content: `Registered and logged in as ${json.username}`,
              duration: 5000,
              type: 'success'
            });
            notificationService.addNotification(notification);
          } else {
            const notification = createNotification({
              content: json.message,
              duration: 5000,
              type: 'error'
            });
            notificationService.addNotification(notification);
          }
        },
        error: err => {
          const notification = createNotification({
            content: err,
            duration: 5000,
            type: 'error'
          });
          notificationService.addNotification(notification);
          return of(err);
        }
      })
    );
  }

  public updateAccountSettings(user: Partial<User>) {
    return fromFetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/users`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this._userQuery.getValue().token}`
      },
      body: JSON.stringify(user)
    }).pipe(
      tap({
        next: async res => {
          const json = await res.json();
          if (res.ok) {
            const user = createUser(json);
            user.loggedIn = true;
            this.userStore.update(user);
            const notification = createNotification({
              content: 'Saved',
              duration: 5000,
              type: 'success'
            });
            notificationService.addNotification(notification);
          } else {
            const notification = createNotification({
              content: json.message,
              duration: 5000,
              type: 'error'
            });
            notificationService.addNotification(notification);
          }
        },
        error: err => {
          const notification = createNotification({
            content: err,
            duration: 5000,
            type: 'error'
          });
          notificationService.addNotification(notification);
          return of(err);
        }
      })
    );
  }

  public changePassword(oldPassword: string, password: string) {
    const body = JSON.stringify({ oldPassword, password });
    // login user and save info to store
    return fromFetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/users/password`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this._userQuery.getValue().token}`
        },
        body
      }).pipe(
        tap({
          next: async res => {
            const json = await res.json();
            if (res.ok) {
              const user = createUser(json);
              user.loggedIn = true;
              this.userStore.update(user);
              if (localStorage.getItem('jwt')) {
                localStorage.setItem('jwt', user.token);
              } else {
                sessionStorage.setItem('jwt', user.token);
              }

              const notification = createNotification({
                content: 'Password changed',
                duration: 5000,
                type: 'success'
              });
              notificationService.addNotification(notification);
            } else {
              const notification = createNotification({
                content: json.message,
                duration: 5000,
                type: 'error'
              });
              notificationService.addNotification(notification);
            }
          },
          error: err => {
            const notification = createNotification({
              content: err,
              duration: 5000,
              type: 'error'
            });
            notificationService.addNotification(notification);
            return of(err);
          }
        })
      );
  }

  public logout() {
    localStorage.removeItem('jwt');
    sessionStorage.removeItem('jwt');
    this.userStore.update(createUser({ loggedIn: false }));
    this._inventoryService.removeInventory();
    const notification = createNotification({
      content: 'Logged out',
      duration: 5000,
      type: 'success'
    });
    notificationService.addNotification(notification);
  }

  public fetchProfile(username: string) {
    return fromFetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/users/get/${username}`)
      .pipe(
        tap({
          next: async res => {
            if (!res.ok) {
              if (res.status !== 400) {
                const notification = createNotification({
                  content: res.statusText,
                  duration: 5000,
                  type: 'error'
                });
                notificationService.addNotification(notification);
              }
            }
          },
          error: err => {
            const notification = createNotification({
              content: err,
              duration: 5000,
              type: 'error'
            });
            notificationService.addNotification(notification);
            return of(err);
          }
        })
      );
  }

  public fetchProfileMarket(username: string) {
    return fromFetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/markets/user/${username}`)
      .pipe(
        tap({
          next: async res => {
            if (!res.ok && res.status !== 404) {
              const notification = createNotification({
                content: res.statusText,
                duration: 5000,
                type: 'error'
              });
              notificationService.addNotification(notification);
            }
          },
          error: err => {
            const notification = createNotification({
              content: err,
              duration: 5000,
              type: 'error'
            });
            notificationService.addNotification(notification);
            return of(err);
          }
        })
      );
  }

  public getSteamFriends() {
    // login user and save info to store
    return fromFetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/steam/friends`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this._userQuery.getValue().token}`
        }
      }).pipe(
        tap({
          next: async () => { },
          error: err => {
            const notification = createNotification({
              content: err,
              duration: 5000,
              type: 'error'
            });
            notificationService.addNotification(notification);
            return of(err);
          }
        })
      );
  }

}

export const userService = new UserService(userStore, userQuery, inventoryService);
