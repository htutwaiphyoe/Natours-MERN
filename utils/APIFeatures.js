module.exports = class {
    constructor(query, urlQuery) {
        this.query = query;
        this.urlQuery = urlQuery;
    }

    filter() {
        // Filtering
        let query = { ...this.urlQuery };
        const excludedFields = ["limit", "sort", "page", "fields"];
        excludedFields.forEach((field) => delete query[field]);

        // Advenced filtering
        query = JSON.parse(
            JSON.stringify(query).replace(/\b(gt|lt|gte|lte|ne)\b/g, (match) => `$${match}`)
        );
        this.query = this.query.find(query);
        return this;
    }

    sort() {
        // sorting
        if (this.urlQuery.sort) {
            this.query = this.query.sort(this.urlQuery.sort.split(",").join(" "));
        } else {
            this.query = this.query.sort("-createdAt");
        }
        return this;
    }

    project() {
        // fields limiting
        if (this.urlQuery.fields) {
            this.query = this.query.select(this.urlQuery.fields.split(",").join(" "));
        } else {
            this.query = this.query.select("-__v");
        }
        return this;
    }

    paginate() {
        // pagination
        const page = +this.urlQuery.page || 1;
        const limit = +this.urlQuery.limit || 10;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
};
