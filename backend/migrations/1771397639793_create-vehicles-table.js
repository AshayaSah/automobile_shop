exports.up = (pgm) => {
    pgm.createType("vehicle_type", ["car", "motorcycle", "scooter"]);
    pgm.createType("vehicle_condition", ["new", "used"]);

    pgm.createTable("vehicles", {
        id: {
            type: "serial",
            primaryKey: true,
        },
        user_id: {
            type: "integer",
            notNull: true,
            references: "users",
            onDelete: "cascade",
        },
        type: {
            type: "vehicle_type",
            notNull: true,
        },
        model: {
            type: "varchar(100)",
            notNull: true,
        },
        price: {
            type: "numeric",
            notNull: true,
        },
        description: {
            type: "text",
        },
        condition: {
            type: "vehicle_condition",
            notNull: true,
        },
        contact: {
            type: "varchar(50)",
            notNull: true,
        },
        images: {
            type: "text[]",
        },
        created_at: {
            type: "timestamp",
            default: pgm.func("current_timestamp"),
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable("vehicles");
    pgm.dropType("vehicle_type");
    pgm.dropType("vehicle_condition");
};
