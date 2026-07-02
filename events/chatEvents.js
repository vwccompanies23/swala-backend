const eventBus = require("./eventBus");

eventBus.on(

    "chat.message.created",

    (message) => {

        console.log(

            "New Chat Message",

            message.id,

        );

    },

);