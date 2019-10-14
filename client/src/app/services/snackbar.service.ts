import { MatSnackBar } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { isnullorundefined } from '../utility/utilities';
import { AppModule } from '../app.module';

/** requires @angular/material, MatSnackBarModule, isnullorundefined */
@Injectable({
    providedIn: 'root'
})
export class snackbarservice
{
    constructor(private snackBar: MatSnackBar)
    {
    }

    public raisemessage = (message: string, title = 'alert') : void => {
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
        
        this.underlyingraise(message)
    }

    private underlyingraise = (message: string, title?: string) : void => {
        let output = `${title}: ${JSON.stringify(message)}`

        this.snackBar.open(output, '', {
            duration: 1000,
            verticalPosition: "top",
            horizontalPosition: "right"            
        });
        console.log(output)
    }
}