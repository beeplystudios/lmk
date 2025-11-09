import chalk from "chalk";
import { NotificationItem } from "./pinecone";
import { createMatchEmail, sendEmail } from "./resend";

export const batchNotifyPost = async (notifications: NotificationItem[]) => {
  console.log(
    chalk.green(
      `notification: sending batch of ${notifications.length} notifications...`
    )
  );

  // send emails
  for (let i = 0; i < notifications.length; i++) {
    const notification = notifications[i];

    console.log(
      chalk.dim(
        `notification: --> [${i + 1}/${
          notifications.length
        }] sending email notification to ${notification.to}...`
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
};
