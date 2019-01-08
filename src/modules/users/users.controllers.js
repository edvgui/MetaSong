async function account(req, res) {
    res.render('account', { title: 'Account' });
}

module.exports = {
    account
};