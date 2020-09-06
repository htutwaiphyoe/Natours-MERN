class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        let queryParams = { ...this.queryString };
        const excludeQuery = ["sort", "page", "limit", "fields"];
        // filtering
        excludeQuery.forEach((field) => delete queryParams[field]);

        // advanced filtering
        queryParams = JSON.parse(
            JSON.stringify(queryParams).replace(/\b(gte|lt|lte|gt)\b/g, (match) => `$${match}`)
        );

        // Query

        this.query.find(queryParams);
        return this;
    }

    sort() {
        if (this.queryString.sort) {
            this.query.sort(this.queryString.sort.split(",").join(" "));
        } else {
            this.query.sort("-createdAt");
        }
        return this;
    }

    projectFields() {
        if (this.queryString.fields) {
            this.query.select(this.queryString.fields.split(",").join(" "));
        } else {
            this.query.select("-__v");
        }
        return this;
    }

    paginate() {
        const page = +this.queryString.page || 1;
        const limit = +this.queryString.limit || 100;
        const skip = (page - 1) * limit;
        this.query.skip(skip).limit(limit);

        return this;
    }
}

module.exports = APIFeatures;
