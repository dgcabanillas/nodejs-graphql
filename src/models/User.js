export default ( sequelize, DataTypes ) => {

    const User = sequelize.define("user", {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isAlphanumeric: {
                    args: true,
                    msg: "El username sólo debe contener letras o números"
                },
                len: {
                    args: [4, 20],
                    msg: "El username debe tener entre 4 y 20 caracteres"
                }
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: {
                    args:true,
                    msg: "El email no es válido"
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM( 'ADMIN', 'EDITOR', 'NORMAL' ),
            defaultValue: 'NORMAL'
        }
    })

    User.associate = models => {
        User.hasMany(models.Article, {
            foreignKey: {
                name: "authorId",
                field: "author_id"
            },
            as: "articles"
        })
    }

    return User;
} 