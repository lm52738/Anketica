const OsobaClass =
    class Ososba {
        constructor(id, id_uloga, ime, prezime, mail, datum_rod, rod, password) {
            this.id = id;
            this.id_uloga = id_uloga;
            this.ime = ime;
            this.prezime = prezime;
            this.mail = mail;
            this.datum_rod = datum_rod;
            this.rod = rod;
            this.password = password;

        }
        get age() {
            return (new Date()).getFullYear() - this.DOB.getFullYear();
        }
        get formattedOsoba() {
            return ((this.rod == 'm') ? 'Mr. ' : 'Mrs.') +
                this.firstName +
                ' ' + this.lastName;
        }
    };
    OsobaClass.prototype.toString = function() {
    return this.formattedAuthor;
}
module.exports = OsobaClass;