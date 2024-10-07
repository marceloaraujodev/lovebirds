// cronJobs.js
import cron from 'node-cron';
import User from '../model/user';
import { removePhotosFromBucket } from '../utils/removePhotosFromBucket';


// Schedule a task to run every day at midnight
cron.schedule('3 17 * * *', async () => {
  console.log('Running daily payment check');

  try {
    const user = await User.find();
    const notPaid = user.filter((item) => item.paid !== true);

    notPaid.forEach((item) => {
      removePhotosFromBucket(item.hash)
    })
  } catch (error) {
    console.error('Error checking pending payments:', error);
  }
});
