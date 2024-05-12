<template>
<div class="container">
	<form id="mysql">
		<div>
			<div class="form-check form-switch">
				<input class="form-check-input" type="checkbox" id="loginYN" name="loginYN" role="switch">
				<label class="form-check-label" for="loginYN">로그인 명령어를 생성하겠습니까?</label>
				<div class="hideDiv" id="loginInfo">
					<div class="input-group input-group-sm mb-3">
						<label class="input-group-text" for="loginID">로그인ID</label>
						<input class="form-control" type="text" id="loginID" name="loginID">
					</div>
				</div>
			</div>
		</div>
		
		<div class="form-check form-switch">
			<input class="form-check-input" type="checkbox" role="switch" id="showDatabase">
			<label class="form-check-label" for="showDatabase">현재 생성된 데이터베이스 목록을 확인하겠습니까?</label>
		</div>
		
		<div>
			<div class="form-check form-switch">
				<input class="form-check-input" type="checkbox" id="createDataBaseYN" name="createDataBaseYN" role="switch">
				<label class="form-check-label" for="createDataBaseYN">데이터베이스 생성 하시겠습니까?</label>
				<div class="hideDiv">
					<div class="input-group input-group-sm mb-3"  id="createDataBaseInfo">
						<span class="input-group-text">데이터베이스명</span>
						<input class="form-control" type="text" id="dataBaseName" name="dataBaseName">
					</div>
				</div>
			</div>
		</div>
		
		<div class="form-check form-switch">
			<input class="form-check-input" type="checkbox" role="switch" name="createUser" id="createUser">
			<label class="form-check-label" for="createUser">계정을 생성할까요?</label>
			<div class="hideDiv">
				<div class="input-group">
					<span class="input-group-text">생성계정 ID</span>
					<input class="form-control" type="text" id="createUserID" name="createUserID" aria-label="First name">
					<span class="input-group-text">@</span>
					<input class="form-control" type="text" id="createUserServer" name="createUserServer" aria-label="First name">
					<span class="input-group-text">생성계정 PW</span>
					<input class="form-control" type="text" id="createUserPW" name="createUserPW" aria-label="Last name">
				</div>
			</div>
		</div>
		
		<div class="form-check form-switch">
			<input class="form-check-input" type="checkbox" role="switch" id="grantAll" name="grantAll">
			<label class="form-check-label" for="grantAll">모든 권한을 부여할 것인가요?</label>
			<div class="hideDiv">
				<label>유저 권한 설정</label>
				<div class="form-floating">
					<input class="form-control" type="text" name="grantID" id="grantID">
					<label class="form-label" for="grantID">권한을 가질 유저를 입력해주세요.</label>
				</div>
				<label>서버 권한 설정</label>
				<div class="form-floating">
					<input class="form-control" type="text" name="grantServer" id="grantServer">
					<label class="form-label" for="grantServer">권한을 가질 서버를 입력해주세요.</label>
				</div>
				<label>데이터베이스 권한 설정</label>
				<div class="form-floating">
					<input class="form-control" type="text" name="grantDatabase" id="grantDatabase">
					<label class="form-label" for="grantDatabase">데이터베이스를 설정해주세요.</label>
				</div>
			</div>
		</div>
		
		<div class="form-check form-switch">
			<input class="form-check-input" type="checkbox" role="switch" id="dumpDB" name="dumpDB">
			<label class="form-check-label" for="dumpDB">데이터베이스를 백업하시겠습니까?</label>
			<div class="hideDiv">
				<label>백업 계정 설정</label>
				<div class="form-floating">
					<input class="form-control" type="text" name="dumpDBUser" id="dumpDBUser">
					<label class="form-label" for="dumpDBUser">백업을 실행할 계정을 입력해주세요.</label>
				</div>
				<label>백업 계정 비밀번호</label>
				<div class="form-floating">
					<input class="form-control" type="text" name="dumpDBPW" id="dumpDBPW">
					<label class="form-label" for="dumpDBPW">백업을 실행할 비밀번호를 입력해주세요.</label>
				</div>
				<label>백업 데이터베이스</label>
				<div class="form-floating">
					<input class="form-control" type="text" name="dumpDBName" id="dumpDBName">
					<label class="form-label" for="dumpDBName">백업을 할 데이터베이스명을 입력해주세요.</label>
				</div>
				<label>백업 경로</label>
				<div class="form-floating">
					<input class="form-control" type="text" name="dumpDBPath" id="dumpDBPath">
					<label class="form-label" for="dumpDBPath">데이터베이스를 백업할 경로 및 파일명을 입력해주세요.</label>
				</div>
			</div>
		</div>
		
		<div class="form-check form-switch">
			<input class="form-check-input" type="checkbox" role="switch" id="restoreDB" name="restoreDB">
			<label class="form-check-label" for="restoreDB">데이터베이스를 복원하시겠습니까?</label>
			<div class="hideDiv">
				<label>복원 계정 설정</label>
				<div class="form-floating">
					<input class="form-control" type="text" name="restoreDBUser" id="restoreDBUser">
					<label class="form-label" for="restoreDBUser">복원을 실행할 계정을 입력해주세요.</label>
				</div>
				<label>복원 계정 비밀번호</label>
				<div class="form-floating">
					<input class="form-control" type="text" name="restoreDBPW" id="restoreDBPW">
					<label class="form-label" for="restoreDBPW">복원을 실행할 비밀번호를 입력해주세요.</label>
				</div>
				<label>복원 데이터베이스</label>
				<div class="form-floating">
					<input class="form-control" type="text" name="restoreDBName" id="restoreDBName">
					<label class="form-label" for="restoreDBName">복원을 할 데이터베이스명을 입력해주세요.</label>
				</div>
				<label>복원 경로</label>
				<div class="form-floating">
					<input class="form-control" type="text" name="restoreDBPath" id="restoreDBPath">
					<label class="form-label" for="restoreDBPath">데이터베이스를 복원할 경로 및 파일명을 입력해주세요.</label>
				</div>
			</div>
		</div>
	</form>
	<br>
	<div style="width:90%;margin:20px;">
		<button id="btn_result" v-on:click="result">결과</button>
		<div class="form-floating">
			<textarea class="form-control" id="resultText" rows="3" style="height:700px;">{{ resultTxt }}</textarea>
			<label for="resultText" class="form-label">결과</label>
		</div>
	</div>
</div>
</template>

<style scoped>
	.form-switch .form-check-input:checked~.hideDiv{
		display:block;
	}
	
	.hideDiv{
		display:none;
	}
</style>

<script lang="ts">
import { ValidValueCount , ElType} from '@/api/cmd/types/cmd';
import { DatabaseInlineScriptBuilder, DatabaseInlineScript } from '@/api/cmd/types/inline/database'

export default {
  data: () =>{
    return {
      mysql: [
        new DatabaseInlineScriptBuilder('loginYN')
          .questionId('loginYN')
          .name('loginYN')
          .elType(ElType.QUESTION)
		  .validValueCount(ValidValueCount.ZERO)
          .label('')
          .desc('로그인 명령어를 생성하겠습니까?')
          .prefix('mysql')
          .children([
            new DatabaseInlineScriptBuilder('loginId')
              .questionId('loginYN')
              .name('loginId')
              .elType(ElType.TEXT)
			  .validValueCount(ValidValueCount.ONE)
              .label('로그인 ID')
              .desc('로그인 할 ID를 등록해주세요.')
              .prefix('-u')
              .suffix('-p')
              .children([])
              .build()
          ])
          .build() ,
      ],
	  resultTxt: ''
    }
  },
  methods: {
	init(){
		let form = document.getElementById('mysql') as HTMLFormElement;
		form.textContent= '';
	},
	result(){
		let tmp = '';
		this.mysql.forEach(script => {
			tmp = tmp + script.toString();
		});

		this.resultTxt = tmp;
	},
    makeFormat(parentId: string, list: DatabaseInlineScript[]){
      list.forEach((databaseInlineScript)=>{
		let parent = document.getElementById(parentId) as HTMLElement;
		let elType = databaseInlineScript.getElType();

		if(elType == ElType.QUESTION){
			this.createQuestionEl(parent, databaseInlineScript);
		}else if(elType == ElType.TEXT){
			this.createTextEl(parent, databaseInlineScript);
		}

		if(databaseInlineScript.getChildren().length > 0){
			this.makeFormat(databaseInlineScript.getId()+"_div", databaseInlineScript.getChildren() as DatabaseInlineScript[]);
		}
	  });
    },
	createQuestionEl(parent: HTMLElement, script: DatabaseInlineScript): void{
		let div = document.createElement('DIV') as HTMLDivElement;
		div.className="form-check form-switch";

		let check = document.createElement('INPUT') as HTMLInputElement;
		check.type= "checkbox";
		check.role="switch";
		check.id= script.getId();
		check.name= script.getName();
		check.className="form-check-input";

		let label = document.createElement('LABEL') as HTMLLabelElement;
		label.setAttribute('for', script.getId());
		label.className = "form-check-label";
		label.textContent = script.getDesc();

		div.appendChild(check);
		div.appendChild(label);

		if(script.getChildren().length>0){
			let hideDiv = document.createElement('DIV') as HTMLDivElement;
			hideDiv.className = "hideDiv";
			hideDiv.id = script.getId()+"_div";

			div.appendChild(hideDiv);
		}

		parent.appendChild(div);
	},
	createTextEl(parent: HTMLElement, script: DatabaseInlineScript): void{
		let label = document.createElement('LABEL') as HTMLLabelElement;
		label.textContent = script.getLabel();
		parent.appendChild(label);

		let floatingDiv = document.createElement("DIV") as HTMLDivElement;
		floatingDiv.className = "form-floating";
		parent.appendChild(floatingDiv);

		let text = document.createElement("INPUT") as HTMLInputElement;
		text.type = "text";
		text.id = script.getId();
		text.name = script.getName();
		text.className = "form-control";
		floatingDiv.appendChild(text);

		let floating = document.createElement('LABEL') as HTMLLabelElement;
		floating.setAttribute("for", script.getId());
		floating.className="form-label";
		floating.textContent = script.getDesc();
		floatingDiv.appendChild(floating);
	}
  },
  mounted(){
	this.init();
	this.makeFormat('mysql', this.mysql as DatabaseInlineScript[]);
  }
}
</script>
