class PresenceSubscriptions {

    constructor() {

        // userId -> Set(subscriberUserIds)
        this.subscribers = new Map();

    }

    //////////////////////////////////////////////////////
    // SUBSCRIBE
    //////////////////////////////////////////////////////

    subscribe(userId, subscriberId) {

        userId = String(userId);
        subscriberId = String(subscriberId);

        let subscribers =
            this.subscribers.get(userId);

        if (!subscribers) {

            subscribers = new Set();

            this.subscribers.set(
                userId,
                subscribers,
            );

        }

        subscribers.add(subscriberId);

    }

    //////////////////////////////////////////////////////
    // UNSUBSCRIBE
    //////////////////////////////////////////////////////

    unsubscribe(userId, subscriberId) {

        userId = String(userId);
        subscriberId = String(subscriberId);

        const subscribers =
            this.subscribers.get(userId);

        if (!subscribers) return;

        subscribers.delete(subscriberId);

        if (subscribers.size === 0) {

            this.subscribers.delete(userId);

        }

    }

    //////////////////////////////////////////////////////
    // GET SUBSCRIBERS
    //////////////////////////////////////////////////////

    getSubscribers(userId) {

        return [
            ...(this.subscribers.get(String(userId)) || [])
        ];

    }

}

module.exports =
    new PresenceSubscriptions();