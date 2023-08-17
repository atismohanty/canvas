import passport from 'passport';
import { Router } from 'express';


class Redirects {
    router: any;
    constructor(router: Router) {
        this.router =  router;
    }

    initRouteRegister() {
        this.router.get('/fbredirect', passport.authenticate('facebook'),
            (req: any, res: any) => {
                console.log('User successfully redirected and authenticated', req.user);
                res.status(200).send(JSON.stringify(req.user));
            }
        );
    }
}

export const RedirectRouteFactory =  () => new Redirects(Router())
