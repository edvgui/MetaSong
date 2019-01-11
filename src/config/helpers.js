const constants = require('./constants');

function generateSidebar(path, user, admin) {
    let sidebarItems = "";
    constants.SIDEBAR.forEach(function (item) {
        sidebarItems += generateSidebarItem(item, path, user, admin);
    })
    return sidebarItems;
}

function generateSidebarItem(item, path, user, admin) {
    if (!isVisible(item.user, user) || !isVisible(item.admin, admin)) return "";
    let sidebarItem = "<li class=\"nav-item\">";
    if (item.subs) {
        if (isActive(path, item.url)) {
            sidebarItem +=
                "<a href=\"#\" class=\"nav-link active\">\n" +
                "    <i class=\"nav-icon " + item.icon + "\"></i>\n" +
                "    <p>\n" +
                item.name + "\n" +
                "       <i class=\"right fa fa-angle-left\"></i>\n" +
                "    </p>\n" +
                "</a>";
            sidebarItem += "<ul class=\"nav nav-treeview\">";
            item.subs.forEach(function (subitem) {
                if (isVisible(subitem.user, user) && isVisible(subitem.admin, admin)) {
                    if (isActive(path, subitem.url)) sidebarItem += "<li class=\"nav-item active\">\n"
                    else sidebarItem += "<li class=\"nav-item\">\n";
                    sidebarItem +=
                        "    <a href=\"" + item.url + "\" class=\"nav-link\">\n" +
                        "       <i class=\"fa fa-circle-o nav-icon\"></i>\n" +
                        "       <p>" + subitem.name + "</p>\n" +
                        "    </a>\n" +
                        "</li>";
                }
            });
            sidebarItem += "</ul>";
        } else {
            sidebarItem +=
                "<a href=\"#\" class=\"nav-link\">\n" +
                "    <i class=\"nav-icon \"" + item.icon + "\"></i>\n" +
                "    <p>\n" +
                item.name + "\n" +
                "       <i class=\"right fa fa-angle-left\"></i>\n" +
                "    </p>\n" +
                "</a>";
        }
    } else {
        if (isActive(path, item.url)) sidebarItem += "<a href=\"" + item.url + "\" class=\"nav-link active\">\n";
        else sidebarItem += "<a href=\"" + item.url + "\" class=\"nav-link\">\n";
        sidebarItem +=
            "    <i class=\"nav-icon " + item.icon + "\"></i>\n" +
            "    <p>\n" +
            item.name + "\n" +
            "    </p>\n" +
            "</a>";
    }
    return sidebarItem + "</li>";
}

function isActive(path, itemUrl) {
    return itemUrl && itemUrl.indexOf(path) !== -1;
}

function isVisible(restriction, right) {
    return right || !restriction;
}

module.exports = {
    generateSidebar
};