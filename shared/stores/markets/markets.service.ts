import { ID } from '@datorama/akita';
import { of } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { tap } from 'rxjs/operators';
import { createNotification } from '../notification/notification.model';
import { notificationService } from '../notification/notification.service';
import { User } from '../user/user.model';
import { userQuery } from '../user/user.query';

export class MarketsService {

  public fetchAllMarkets() {
    // get all items and save them in the store
    return fromFetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/markets`).pipe(
      tap({
        next: async res => {
          if (!res.ok) {
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

  public fetchOwnMarket() {
    return fromFetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/markets/own`,
      {
        headers: {
          'Authorization': `Bearer ${userQuery.getValue().token}`
        }
      }).pipe(
        tap({
          next: async res => {
            if (!res.ok) {
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

  public editMarket(body: { offerlistNote: string, wishlistNote: string; }) {
    return fromFetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/markets`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userQuery.getValue().token}`
        },
        body: JSON.stringify(body)
      }).pipe(
        tap({
          next: async res => {
            if (res.ok) {
              const notification = createNotification({
                content: 'Note updated',
                duration: 5000,
                type: 'success'
              });
              notificationService.addNotification(notification);
            } else {
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

  public fetchUserMarket(username: string) {
    return fromFetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/markets/user/${username}`).pipe(
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

  public fetchPrices() {
    return fromFetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/markets/prices`).pipe(
      tap({
        next: async res => {
          if (!res.ok) {
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

  public createOffer(offer: any, user: User) {
    return fromFetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/markets/offers`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(offer)
      }).pipe(
        tap({
          next: async res => {
            if (res.ok) {
              const notification = createNotification({
                content: 'Offer created',
                duration: 5000,
                type: 'success'
              });
              notificationService.addNotification(notification);
            } else {
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

  public syncOffers(data: any, user: User) {
    return fromFetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/market/offer/`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(data)
      }).pipe(
        tap({
          next: async res => {
            if (res.ok) {
              const json = await res.json();
              const notification = createNotification({
                content: `${json.newOffers} offer${json.newOffers === 1 ? '' : 's'} created and ${json.updatedOffers} updated`,
                duration: 5000,
                type: 'success'
              });
              notificationService.addNotification(notification);
            } else {
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

  public editOffer(id: ID, offer: any, user: User) {
    return fromFetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/market/offer/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(offer)
      }).pipe(
        tap({
          next: async res => {
            if (res.ok) {
              const notification = createNotification({
                content: 'Offer edited',
                duration: 5000,
                type: 'success'
              });
              notificationService.addNotification(notification);
            } else {
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

  public deleteOffer(id: ID, user: User) {
    return fromFetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/market/offer/${id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      }).pipe(
        tap({
          next: async res => {
            if (res.ok) {
              const notification = createNotification({
                content: 'Offer deleted',
                duration: 5000,
                type: 'success'
              });
              notificationService.addNotification(notification);
            } else {
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

  public deleteAllOffers(user: User) {
    return fromFetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/market/offer`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      }).pipe(
        tap({
          next: async res => {
            if (res.ok) {
              const notification = createNotification({
                content: 'All offers deleted',
                duration: 5000,
                type: 'success'
              });
              notificationService.addNotification(notification);
            } else {
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

  public createWish(wish: any, user: User) {
    return fromFetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/market/wish/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(wish)
      }).pipe(
        tap({
          next: async res => {
            if (res.ok) {
              const notification = createNotification({
                content: 'Wish list item created',
                duration: 5000,
                type: 'success'
              });
              notificationService.addNotification(notification);
            } else {
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

  public deleteWish(id: ID, user: User) {
    return fromFetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/market/wish/${id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      }).pipe(
        tap({
          next: async res => {
            if (res.ok) {
              const notification = createNotification({
                content: 'Wish list item deleted',
                duration: 5000,
                type: 'success'
              });
              notificationService.addNotification(notification);
            } else {
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

}

export const marketsService = new MarketsService();
