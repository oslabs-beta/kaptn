import React from 'React';
import { render, screen, waitFor } from '@testing-library/react';
import SideNav from "../src/components/Sidebar"
import CommandLine from "../src/components/CommandLine"
import "@testing-library/jest-dom";
// import { ColorModeContext } from '../src/theme';
import { ProSidebarProvider } from "react-pro-sidebar";
import { MemoryRouter } from "react-router-dom";



//Testing Client Side Components
describe('Unit Testing Client Side Components', () => {
    //Testing Sidebar Component
    describe('Sidebar test', () => {
        // let sidebarLinks;

          beforeEach(() => {
              render(
                    <ProSidebarProvider>
                      <SideNav />  
                    </ProSidebarProvider>
              );
          });
        //Renders 5 links
        it('Renders five links', () => {
            const links = screen.getAllByRole('link');
            expect(links.length).toBe(5)
        })
    })
    describe('CommandLine test', () => {
        // let sidebarLinks;

          beforeEach(() => {
              render(
                <CommandLine/>
              );
          });
        //Renders 5 links
        it('Renders five links', () => {
            const buttons = screen.getAllByRole('button');
            expect(buttons.length).toBe(2)
        })
        it('Renders one TextField', () => {
            const textField = screen.getAllByRole('textbox');
            expect(textField.length).toBe(1)
        })


    })

})