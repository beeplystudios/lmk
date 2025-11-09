import { Expo, ExpoPushMessage, ExpoPushTicket } from "expo-server-sdk";

let expo = new Expo({
  //   accessToken: process.env.EXPO_ACCESS_TOKEN, // token needed if we enable push security
});

export const notify = async (notifs: ExpoPushMessage[]) => {
  let chunks = expo.chunkPushNotifications(notifs);
  let tickets: ExpoPushTicket[] = [];
  chunks.forEach(async (chunk) => {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      //   console.log(ticketChunk);
      tickets.push(...ticketChunk);
      // NOTE: If a ticket contains an error code in ticket.details.error, you
      // must handle it appropriately. The error codes are listed in the Expo
      // documentation:
      // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
    } catch (error) {
      console.error(error);
    }
  });

  ////  ticket's DeviceNotRegistered error indicates that the user does not accept notifs from us anymore
  //   tickets.forEach((ticket) => {
  //     if (ticket.status == "error") {
  //       const { error, expoPushToken } = ticket.details;
  //       if (error == "DeviceNotRegistered") {
  //       }
  //     }
  //   });
};
