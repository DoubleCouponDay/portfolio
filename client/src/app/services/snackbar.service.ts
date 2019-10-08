import { MatSnackBar } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { isnullorundefined } from '../utility/utilities';

/** requires @angular/material, util, @types/util, MatSnackBarModule */
@Injectable({
    providedIn: 'root'
})
export default class snackbarservice
{
    constructor(private snackBar: MatSnackBar)
    {
    }

    public raisemessage = (message: string, title?:string) : void => {
        this.underlyingraise(message, title)
    }

    public raiseerror = (error: Error) : void => {    
        let message: string

        if(error instanceof HttpErrorResponse)
        {
            let castasresponse = <HttpErrorResponse>error
            message = `${castasresponse.status}: ${castasresponse.message}`
        }

        else
        {
            message = isnullorundefined(error.message) ? <any>error : error.message   
        }
        
        this.underlyingraise(message, null)
    }

    private underlyingraise = (message: string, title?:string) : void => {
        let titletouse = isnullorundefined(title) === false ? title : ''
        let output = `${titletouse}: ${JSON.stringify(message)}`

        this.snackBar.open(output, '', {
            duration: 999999999,
            verticalPosition: "top",
            horizontalPosition: "right"
        });
        console.log(output)
    }
}