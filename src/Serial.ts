export class Serial {

    private serial = 0;

    public next() {
        this.serial++;
        return this.serial;
    }

}