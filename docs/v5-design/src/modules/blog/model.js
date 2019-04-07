export default function({ sequelize }) {
  const Model = sequelize.define("blog", {
    uuid: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    }
  });

  return Model;
}
