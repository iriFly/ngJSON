import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  //Add 'implements OnInit' to the class.

  stateList = ["New", "Second hand", "Vintage", "Refurbished"];
  actionBtn: string = "Save";
  productForm !: FormGroup;
  constructor(private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private api: ApiService,
    private dialogRef: MatDialogRef<DialogComponent>) {}

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      productName: ['', Validators.required],
      category: ['', Validators.required],
      state: ['', Validators.required],
      price: ['', Validators.required],
      comment: ['', Validators.required],
      date: ['', Validators.required]
    });

    console.log(this.editData);
    if(this.editData){
      this.actionBtn = "Update";
      this.productForm.controls['productName'].setValue(this.editData.productName);
      this.productForm.controls['category'].setValue(this.editData.category);
      this.productForm.controls['state'].setValue(this.editData.state);
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['comment'].setValue(this.editData.comment);
      this.productForm.controls['date'].setValue(this.editData.date)

    }
  }

  addProduct(){
    if(!this.editData){
      if(this.productForm.valid){
        this.api.postProduct(this.productForm.value)
        .subscribe({
          next:(res)=> {
            alert("Product addedd successfully!");
            this.productForm.reset();
            this.dialogRef.close('save');
          },
          error:() => {
            alert("Error while adding the product")
          }
        })
       } else {
        this.updateProduct()
       }
    }
  }

    updateProduct(){
      this.api.putProduct(this.productForm.valid, this.editData.id)
      .subscribe({
        next: (res) => {
          alert("Product updated Sucessfully");
          this.productForm.reset();
          this.dialogRef.close('update');

        },
        error:() => {
          alert("Error while updating the record");
        }
      })
    }

  }



