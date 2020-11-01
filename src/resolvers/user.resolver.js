export default {
    Query: {
        allUsers: (_, args, {models} ) => {
            return models.User.findAll({
                include: [{
                    model: models.Article,
                    as: "articles",
                    include: [{
                        model: models.Tag,
                        as: "tags"
                    }]
                }]
            });
        }
    },
    Mutation: {
        signUp: (_, args, {models} ) => {
            return models.User.create( args );
        }
    }
}