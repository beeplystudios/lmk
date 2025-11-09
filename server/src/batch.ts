import chalk from "chalk";
import { NotificationItem } from "./pinecone";
import { createMatchEmail, sendEmail } from "./resend";
import { notify } from "./utils/notify";

export const batchNotifyPost = async (notifications: NotificationItem[]) => {
  console.log(
    chalk.green(
      `notification: sending batch of ${notifications.length} notifications...`
    )
  );

  console.log(
    chalk.dim("notification: sending bulk push notifications via Expo...")
  );

  try {
    await notify(
      notifications.map((notification) => ({
        to: notification.to,
        title: notification.title,
        body: notification.body,
        data: notification.data,
      }))
    );
  } catch (err) {
    console.warn("notification: error sending push notifications:", err);
  }

  try {
    // send emails
    for (let i = 0; i < notifications.length; i++) {
      const notification = notifications[i];

      console.log(
        chalk.dim(
          `notification: --> [${i + 1}/${
            notifications.length
          }] sending email notification to token=${notification.to}, email=${
            notification.email
          }...`
        )
      );

      await sendEmail(
        notification.email,
        createMatchEmail(
          notification.title,
          notification.link,
          notification.source
        )
      );
    }
  } catch (err) {
    console.warn("notification: error sending email notifications:", err);
  }
};
