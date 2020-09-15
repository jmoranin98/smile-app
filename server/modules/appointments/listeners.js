const database = require('../../database');

const onBudgetRequestCompleted = async (data) => {
  const items = data;
  let appointmentId;

  if (Array.isArray(items) && items.length > 0) {
    appointmentId = items[0].appointmentId;

    const formattedItems = items.map(item => ({
      appointmentId: item.appointmentId,
      quantity: item.quantity,
      totalPrice: item.submonto,
      productId: item.productId,
    }));

    try {
      await database('materials')
        .insert(formattedItems)
        .returning('*');

      const { doctorId } = await database.select('doctorId')
        .from('appointments')
        .where('id', appointmentId)
        .first();

      const newNotification = {
        userId: doctorId,
        title: 'Nueva proforma lista',
        message: `La proforma para la cita #${appointmentId} está lista`,
        seems: false,
        createdAt: new Date(),
      };
      console.log(newNotification);
      await database('notifications')
        .insert(newNotification);
    } catch (error) {
      console.error(error);
    }
  };
};

module.exports = {
  onBudgetRequestCompleted,
};
