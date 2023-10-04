# Combobox

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.2.0.

# How to use this library

# Events / Output properties

  
  1.FilterChange: Implies change in input filter criteria types on search box
  
  2. DropDownClose: Emits when drop down is closed


  3. Select: Emits when a new Item is selected -- emited value contains new selected Item -- type: BindValue/ Array of BindValues


  4. DeSelect: Emits when a new Item is DeSelected -- emited value contains new DeSelected Item -- type: BindValue
 


  5. onChange: Emits when value of combobox changes , emitted value type - array of latest binded values (Bind values)


  # Inputs

  1.placeholder -- place holder when no value is selected Type: string

  2.disabled: to disable the combobox  Type: Boolean Default value: false

  3.setting: Config settings for combo box
   Type: IDropdownConfig

  4. data = list of items to be displayed in combobox

 # Interface

IDropdownConfig -- Iterface for providing config settings for combo box
# Support
Support: Reactive Forms, Template driven form, NdModel/StandAlone use field

# Acessbility
Basic Acessibity with tab index and aria value


# Example

(https://stackblitz.com/edit/angular-dropdown-wrapper)




 
